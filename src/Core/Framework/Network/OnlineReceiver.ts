import { BlockingField } from '../../Items/Cell/Field/BlockingField';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { Identity } from '../../Items/Identity';
import { GameContext } from '../Context/GameContext';
import { FieldHelper } from '../FieldTypeHelper';
import { PathResolver } from './PathResolver';
import { ISocketWrapper } from '../../../Network/Socket/INetworkSocket';
import { PacketKind } from '../../../Network/Message/PacketKind';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { NextCellContent } from './Contents/NextCellContent';
import { TargetContent } from './Contents/TargetContent';
import { StaticLogger } from '../../Utils/Logger/StaticLogger';
import { LogKind } from '../../Utils/Logger/LogKind';
import { ItemsUpdater } from '../../ItemsUpdater';
import { PacketContent } from './Contents/PacketContent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export class OnlineReceiver {
	public OnInconsistency: LiteEvent<Date> = new LiteEvent<Date>();
	private _pathResolver: PathResolver;
	private _obs: NetworkObserver[];
	constructor(private _socket: ISocketWrapper, private _context: GameContext) {
		this._pathResolver = new PathResolver(this._context);
		this._obs = [
			new NetworkObserver(PacketKind.VehicleCreated, this.HandleVehicleCreated.bind(this)),
			new NetworkObserver(PacketKind.VehicleDestroyed, this.HandleVehicleDestroyed.bind(this)),
			new NetworkObserver(PacketKind.Target, this.HandleTarget.bind(this)),
			new NetworkObserver(PacketKind.Camouflage, this.HandleCamouflage.bind(this)),
			new NetworkObserver(PacketKind.PathChanged, this.HandlePathChanged.bind(this)),
			new NetworkObserver(PacketKind.FieldChanged, this.HandleChangedField.bind(this)),
			new NetworkObserver(PacketKind.FieldDestroyed, this.HandleDestroyedField.bind(this)),
			new NetworkObserver(PacketKind.PowerChanged, this.HandleEnergyChanged.bind(this)),
			new NetworkObserver(PacketKind.Overclocked, this.HandleOverlocked.bind(this))
		];
		this._obs.forEach((ob) => {
			this._socket.OnReceived.On(ob);
		});
	}

	public Clear(): void {
		this._obs.forEach((ob) => {
			this._socket.OnReceived.Off(ob);
		});
	}

	private GetId(id: string): Identity {
		return new Identity(id, null, null);
	}

	private IsEmitingHq(name: string): boolean {
		const hq = this._context.GetHqFromId(this.GetId(name));
		return hq && hq.Identity.Name !== this._context.GetPlayerHq().Identity.Name && !hq.IsIa();
	}

	private HandleVehicleDestroyed(message: NetworkMessage<PacketContent<any>>): void {
		const vehicle = this._context.GetVehicle(message.Content.VId);
		if (vehicle) {
			if (vehicle.IsAlive()) {
				vehicle.SetCurrentLife(0);
				StaticLogger.Log(LogKind.info, `[DESTROY] ${message.Content.VId}`);
			}
		} else {
			this.HandleConsistency(`[CONSISTENCY] ${message.Content.VId} not found`);
		}
	}

	private HandleConsistency(message: string) {
		StaticLogger.Log(LogKind.error, message);
		this.OnInconsistency.Invoke(Date.now());
	}

	private HandleVehicleCreated(message: NetworkMessage<PacketContent<any>>): void {
		if (this.IsEmitingHq(message.Content.Id)) {
			if (!this._context.ExistUnit(message.Content.VId)) {
				const hq = this._context.GetHqFromId(this.GetId(message.Content.Id));
				const coo = this._context.GetCell(message.Content.CId);
				if (message.Content.Type === 'Tank') {
					hq.CreateTank(coo);
				} else if (message.Content.Type === 'Truck') {
					hq.CreateTruck(coo);
				}
			} else {
				this.HandleConsistency(`[CONSISTENCY] ${message.Content.VId} already exists`);
			}
		}
	}

	private HandleTarget(message: NetworkMessage<PacketContent<TargetContent>>): void {
		const content = message.Content;
		const tank = this._context.GetTank(content.VId);
		if (this.IsEmitingHq(message.Content.Id)) {
			if (content.Extra.HasTarget && content.Extra.TargetCId) {
				const cell = this._context.GetCell(content.Extra.TargetCId);
				tank.SetMainTarget(cell.GetShootableEntity());
			} else {
				tank.SetMainTarget(null);
			}
			StaticLogger.Log(LogKind.info, `[TARGET] ${message.Content.VId}`);
		}
	}

	private HandleCamouflage(message: NetworkMessage<string>): void {
		const unit = this._context.GetTank(message.Content);
		const hq = this._context.GetHqFromId(unit.Identity);
		if (this.IsEmitingHq(hq.Identity.Name)) {
			unit.SetCamouflage();
			StaticLogger.Log(LogKind.info, `[CAMOUFLAGE] ${unit.Id}`);
		}
	}

	private HandlePathChanged(message: NetworkMessage<PacketContent<NextCellContent>>): void {
		const latency = message.Latency + Math.round(ItemsUpdater.UpdateSpan / 2);
		const vId = message.Content.VId;
		const vehicle = this._context.GetVehicle(vId);
		if (vehicle) {
			const hq = this._context.GetHqFromId(vehicle.Identity);
			if (this.IsEmitingHq(hq.Identity.Name)) {
				if (
					this._pathResolver.Resolve(
						vehicle,
						message.Content.Extra.Path,
						message.Content.CId,
						message.Content.Extra.NextCId,
						latency
					)
				) {
					this.HandleConsistency(`[CONSISTENCY] ${message.Content.VId} wrong cell`);
				} else {
					StaticLogger.Log(LogKind.info, `[PATH CHANGED] ${message.Content.VId}`);
				}
			}
		} else {
			this.HandleConsistency(`[CONSISTENCY] ${message.Content.VId} not found`);
		}
	}

	private HandleDestroyedField(message: NetworkMessage<string>): void {
		const field = this._context.GetCell(message.Content).GetField();
		if (field instanceof BlockingField) {
			const blockingField = field as BlockingField;
			if (blockingField.IsAlive()) {
				blockingField.Destroy();
				StaticLogger.Log(LogKind.info, `[DESTROY] ${message.Content}`);
			}
		}
	}

	private HandleChangedField(message: NetworkMessage<PacketContent<any>>): void {
		if (message.Content.Type === 'BasicField') {
			return;
		}
		const cell = this._context.GetCell(message.Content.CId);
		const hq = this.GetHq(message);
		if (this.IsEmitingHq(hq.Identity.Name)) {
			if (TypeTranslator.IsSpecialField(cell.GetField())) {
				this.HandleConsistency(
					`[CONSISTENCY] ${message.Content.Type} ${message.Content.CId} is not a basic field`
				);
			}
			const field = FieldHelper.NewField(message.Content.Type, cell, hq, this._context);
			StaticLogger.Log(LogKind.info, `[CREATE] ${message.Content.CId} ${message.Content.Type}`);
		}
	}

	private GetHq(message: NetworkMessage<PacketContent<any>>) {
		return message.Content.Id ? this._context.GetHqFromId(this.GetId(message.Content.Id)) : null;
	}

	private HandleEnergyChanged(message: NetworkMessage<PacketContent<boolean>>): void {
		const hq = this.GetHq(message);
		if (this.IsEmitingHq(hq.Identity.Name)) {
			const cell = this._context.GetCell(message.Content.CId);
			const reactor = cell.GetField() as ReactorField;
			if (message.Content.Extra) {
				reactor.EnergyUp();
			} else {
				reactor.EnergyDown();
			}
			StaticLogger.Log(LogKind.info, `[ENERGY] ${message.Content.CId} ${message.Content.Type}`);
		}
	}

	private HandleOverlocked(message: NetworkMessage<PacketContent<string>>): void {
		const hq = this.GetHq(message);
		if (this.IsEmitingHq(hq.Identity.Name)) {
			const cell = this._context.GetCell(message.Content.CId);
			const reactor = cell.GetField() as ReactorField;
			reactor.Overclock(TypeTranslator.GetPowerUp(message.Content.Extra));
			StaticLogger.Log(LogKind.info, `[OVERCLOCK] ${message.Content.CId} ${message.Content.Type}`);
		}
	}
}
