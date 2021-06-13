import { OverlockedPacket } from './Packets/OverlockedPacket';
import { ReactorField } from '../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { FieldTypeHelper } from './Packets/FieldTypeHelper';
import { PacketKind } from '../../Network/Message/PacketKind';
import { TargetPacket } from './Packets/TargetPacket';
import { NetworkMessage } from '../../Network/Message/NetworkMessage';
import { GameContext } from '../Setup/Context/GameContext';
import { CreatingUnitPacket } from './Packets/CreatingUnitPacket';
import { NetworkObserver } from '../Utils/Events/NetworkObserver';
import { NextCellPacket } from './Packets/NextCellPacket';
import { FieldPacket } from './Packets/FieldPacket';
import { TypeTranslator } from '../Items/Cell/Field/TypeTranslator';
import { PowerFieldPacket } from './Packets/PowerFieldPacket';
import { isNullOrUndefined } from '../Utils/ToolBox';
import { ISocketWrapper } from '../../Network/Socket/INetworkSocket';

export class OnlineRuntimeReceiver {
	private _obs: NetworkObserver[];
	constructor(private _socket: ISocketWrapper, private _context: GameContext) {
		this._obs = [
			new NetworkObserver(PacketKind.UnitCreated, this.HandleCreatingUnit.bind(this)),
			new NetworkObserver(PacketKind.Target, this.HandleTarget.bind(this)),
			new NetworkObserver(PacketKind.Camouflage, this.HandleCamouflage.bind(this)),
			new NetworkObserver(PacketKind.NextCell, this.HandleNextCell.bind(this)),
			new NetworkObserver(PacketKind.FieldChanged, this.HandleChangedField.bind(this)),
			new NetworkObserver(PacketKind.PowerChanged, this.HandlePowerChanged.bind(this)),
			new NetworkObserver(PacketKind.Overlocked, this.HandleOverlocked.bind(this)),
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

	private HandleCreatingUnit(message: NetworkMessage<CreatingUnitPacket>): void {
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

	private HandleNextCell(message: NetworkMessage<NextCellPacket>): void {
		const unit = this._context.GetUnit(message.Content.Id);
		const cell = this._context.GetCell(message.Content.Coo);
		const hq = this._context.GetHqFromId(unit.Identity);

		if (this.IsListenedHq(hq.GetCell().Coo())) {
			unit.SetNextCell(cell);
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

	private HandlePowerChanged(message: NetworkMessage<PowerFieldPacket>): void {
		const cell = this._context.GetCell(message.Content.Coo);
		const hq = isNullOrUndefined(message.Content.HqCoo) ? null : this._context.GetHq(message.Content.HqCoo);
		if (this.IsListenedHq(message.Content.HqCoo)) {
			const reactor = cell.GetField() as ReactorField;
			if (message.Content.Power === true) {
				reactor.PowerUp();
			} else if (message.Content.Power === false) {
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
