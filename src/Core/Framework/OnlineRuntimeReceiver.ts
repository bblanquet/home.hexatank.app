import { OverlockedPacket } from './Packets/OverlockedPacket';
import { ReactorField } from '../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { FieldTypeHelper } from './Packets/FieldTypeHelper';
import { PacketKind } from '../../Network/Message/PacketKind';
import { TargetPacket } from './Packets/TargetPacket';
import { NetworkMessage } from '../../Network/Message/NetworkMessage';
import { GameContext } from '../Setup/Context/GameContext';
import { VehiclePacket } from './Packets/CreatingUnitPacket';
import { NetworkObserver } from '../Utils/Events/NetworkObserver';
import { NextCellPacket } from './Packets/NextCellPacket';
import { FieldPacket } from './Packets/FieldPacket';
import { TypeTranslator } from '../Items/Cell/Field/TypeTranslator';
import { EnergyPacket } from './Packets/PowerFieldPacket';
import { isNullOrUndefined } from '../Utils/ToolBox';
import { ISocketWrapper } from '../../Network/Socket/INetworkSocket';
import { BasicOrder } from '../Ia/Order/BasicOrder';
import { Vehicle } from '../Items/Unit/Vehicle';
import { BlockingField } from '../Items/Cell/Field/BlockingField';
import { LatencyUp } from '../Items/Unit/PowerUp/LatencyUp';
import { LatencyCondition } from '../Items/Unit/PowerUp/Condition/LatencyCondition';
import { Cell } from '../Items/Cell/Cell';

export class OnlineRuntimeReceiver {
	private _obs: NetworkObserver[];
	constructor(private _socket: ISocketWrapper, private _context: GameContext) {
		this._obs = [
			new NetworkObserver(PacketKind.VehicleCreated, this.HandleVehicleCreated.bind(this)),
			new NetworkObserver(PacketKind.VehicleDestroyed, this.HandleVehicleDestroyed.bind(this)),
			new NetworkObserver(PacketKind.Target, this.HandleTarget.bind(this)),
			new NetworkObserver(PacketKind.Camouflage, this.HandleCamouflage.bind(this)),
			new NetworkObserver(PacketKind.PathChanged, this.HandlePathChanged.bind(this)),
			new NetworkObserver(PacketKind.FieldChanged, this.HandleChangedField.bind(this)),
			new NetworkObserver(PacketKind.FieldDestroyed, this.HandleDestroyedField.bind(this)),
			new NetworkObserver(PacketKind.PowerChanged, this.HandleEnergyChanged.bind(this)),
			new NetworkObserver(PacketKind.Overlocked, this.HandleOverlocked.bind(this))
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

	private IsListenedHq(coo: string): boolean {
		const hq = this._context.GetCell(coo).GetField() as Headquarter;
		return !isNullOrUndefined(hq) && hq.Identity.Name !== this._context.GetPlayerHq().Identity.Name && !hq.IsIa();
	}

	private HandleVehicleDestroyed(message: NetworkMessage<VehiclePacket>): void {
		const vehicle = this._context.GetVehicle(message.Content.Id);
		if (vehicle.IsAlive()) {
			vehicle.SetCurrentLife(0);
		}
	}

	private HandleVehicleCreated(message: NetworkMessage<VehiclePacket>): void {
		const packet = message.Content;
		if (this.IsListenedHq(packet.HqCoo)) {
			if (!this._context.ExistUnit(packet.Id)) {
				const hq = this._context.GetCell(packet.HqCoo).GetField() as Headquarter;
				const pos = this._context.GetCell(packet.Coo);
				if (packet.Kind === 'Tank') {
					hq.CreateTank(pos);
				} else if (packet.Kind === 'Truck') {
					hq.CreateTruck(pos);
				}
			}
		}
	}

	private HandleTarget(message: NetworkMessage<TargetPacket>): void {
		const content = message.Content;
		const tank = this._context.GetTank(content.Id);
		const hq = this._context.GetHqFromId(tank.Identity);
		if (this.IsListenedHq(hq.GetCell().Coo())) {
			if (content.HasTarget && content.TagertCoo) {
				const cell = this._context.GetCell(content.TagertCoo);
				tank.SetMainTarget(cell.GetShootableEntity());
			} else {
				tank.SetMainTarget(null);
			}
		}
	}

	private HandleCamouflage(message: NetworkMessage<string>): void {
		const unit = this._context.GetTank(message.Content);
		const hq = this._context.GetHqFromId(unit.Identity);
		if (this.IsListenedHq(hq.GetCell().Coo())) {
			unit.SetCamouflage();
		}
	}

	private HandlePathChanged(message: NetworkMessage<NextCellPacket>): void {
		const latency = message.Latency;
		const vehicle = this._context.GetVehicle(message.Content.Id);
		const hq = this._context.GetHqFromId(vehicle.Identity);

		if (this.IsListenedHq(hq.GetCell().Coo())) {
			const dic = this._context.GetCellDictionary();
			const path = message.Content.Path.map((coo) => dic.Get(coo));
			if (0 < path.length) {
				if (
					(vehicle.GetCurrentCell().Coo() === message.Content.CC &&
						this.IsNextCellEqualed(vehicle, message.Content.NC)) ||
					vehicle.GetCurrentCell().Coo() === message.Content.NC
				) {
					const order = new BasicOrder(vehicle, path);
					vehicle.GiveOrder(order);
					this.LatencyCompensation(latency, vehicle, order, path);
					console.log(`%c latency compensation ${latency}`, 'color:#68b81d;font-weight:bold;');
				} else if (
					vehicle.GetCurrentCell().Coo() === message.Content.CC &&
					!this.IsNextCellEqualed(vehicle, message.Content.NC)
				) {
					const order = new BasicOrder(vehicle, path);
					vehicle.ForceCancel(order);
					this.LatencyCompensation(latency, vehicle, order, path);
					console.log(`%c [FORCE CANCEL] latency compensation ${latency}`, 'color:#b8631d;font-weight:bold;');
				} else if (vehicle.GetCurrentCell().Coo() !== message.Content.CC) {
					const cell = dic.Get(message.Content.CC);
					const order = new BasicOrder(vehicle, path);
					vehicle.ForceCell(cell, order);
					this.LatencyCompensation(latency, vehicle, order, path);
					console.log(`%c [FORCE CELL] latency compensation ${latency}`, 'color:#a81b1b;font-weight:bold;');
				}
			}
		}
	}

	private LatencyCompensation(latency: number, vehicle: Vehicle, order: BasicOrder, path: Cell[]) {
		if (latency && 0 < latency) {
			vehicle.SetPowerUp(new LatencyUp(vehicle, new LatencyCondition(vehicle, order), latency / path.length));
		}
	}

	private IsNextCellEqualed(v: Vehicle, coo: string): boolean {
		if (v.GetNextCell()) {
			return v.GetNextCell().Coo() === coo;
		} else {
			return coo === '';
		}
	}

	private HandleDestroyedField(message: NetworkMessage<string>): void {
		const field = this._context.GetCell(message.Content).GetField();
		if (field instanceof BlockingField) {
			const blockingField = field as BlockingField;
			if (blockingField.IsAlive()) {
				blockingField.Destroy();
			}
		}
	}

	private HandleChangedField(message: NetworkMessage<FieldPacket>): void {
		if (message.Content.Type === 'BasicField') {
			return;
		}
		const cell = this._context.GetCell(message.Content.Coo);
		const hq = isNullOrUndefined(message.Content.HqCoo) ? null : this._context.GetHq(message.Content.HqCoo);
		if (this.IsListenedHq(message.Content.HqCoo)) {
			const field = FieldTypeHelper.CreateField(message.Content.Type, cell, hq, this._context);
		}
	}

	private HandleEnergyChanged(message: NetworkMessage<EnergyPacket>): void {
		const cell = this._context.GetCell(message.Content.Coo);
		const hq = isNullOrUndefined(message.Content.HqCoo) ? null : this._context.GetHq(message.Content.HqCoo);
		if (this.IsListenedHq(message.Content.HqCoo)) {
			const reactor = cell.GetField() as ReactorField;
			if (message.Content.IsEnergyUp) {
				reactor.PowerUp();
			} else {
				reactor.PowerDown();
			}
		}
	}

	private HandleOverlocked(message: NetworkMessage<OverlockedPacket>): void {
		const cell = this._context.GetCell(message.Content.Coo);
		const hq = isNullOrUndefined(message.Content.HqCoo) ? null : this._context.GetHq(message.Content.HqCoo);
		if (this.IsListenedHq(message.Content.HqCoo)) {
			const reactor = cell.GetField() as ReactorField;
			reactor.Overlock(TypeTranslator.GetPowerUp(message.Content.PowerUp));
		}
	}
}
