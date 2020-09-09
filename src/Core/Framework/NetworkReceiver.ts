import { OverlockedPacket } from './Packets/OverlockedPacket';
import { ReactorField } from './../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from './../Items/Cell/Field/Hq/Headquarter';
import { IaHeadquarter } from './../Ia/IaHeadquarter';
import { isNullOrUndefined } from 'util';
import { FieldTypeHelper } from './Packets/FieldTypeHelper';
import { PacketKind } from './../../Network/Message/PacketKind';
import { TargetPacket } from './Packets/TargetPacket';
import { NetworkMessage } from './../../Network/Message/NetworkMessage';
import { GameContext } from './GameContext';
import { CreatingUnitPacket } from './Packets/CreatingUnitPacket';
import { NetworkObserver } from '../../Network/NetworkObserver';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { NextCellPacket } from './Packets/NextCellPacket';
import { FieldPacket } from './Packets/FieldPacket';
import { FieldHelper } from '../Items/Cell/Field/FieldHelper';
import { PowerFieldPacket } from './Packets/PowerFieldPacket';

export class NetworkReceiver {
	private _creatingUnitObserver: NetworkObserver;
	private _targetObserver: NetworkObserver;
	private _camouflageObserver: NetworkObserver;
	private _nextCellObserver: NetworkObserver;
	private _fieldObserver: NetworkObserver;
	private _powerObserver: NetworkObserver;
	private _overlockedObserver: NetworkObserver;

	constructor(private _socket: NetworkSocket, private _context: GameContext) {
		this._creatingUnitObserver = new NetworkObserver(PacketKind.UnitCreated, this.HandleCreatingUnit.bind(this));
		this._targetObserver = new NetworkObserver(PacketKind.Target, this.HandleTarget.bind(this));
		this._camouflageObserver = new NetworkObserver(PacketKind.Camouflage, this.HandleCamouflage.bind(this));
		this._nextCellObserver = new NetworkObserver(PacketKind.NextCell, this.HandleNextCell.bind(this));
		this._fieldObserver = new NetworkObserver(PacketKind.FieldChanged, this.HandleChangedField.bind(this));
		this._powerObserver = new NetworkObserver(PacketKind.PowerChanged, this.HandlePowerChanged.bind(this));
		this._overlockedObserver = new NetworkObserver(PacketKind.Overlocked, this.HandleOverlocked.bind(this));

		this._socket.OnReceived.On(this._creatingUnitObserver);
		this._socket.OnReceived.On(this._targetObserver);
		this._socket.OnReceived.On(this._camouflageObserver);
		this._socket.OnReceived.On(this._nextCellObserver);
		this._socket.OnReceived.On(this._fieldObserver);
		this._socket.OnReceived.On(this._powerObserver);
		this._socket.OnReceived.On(this._overlockedObserver);
	}

	private IsListenedHq(coo: string): boolean {
		const hq = this._context.GetCell(coo).GetField() as Headquarter;
		return (
			!isNullOrUndefined(hq) &&
			hq.PlayerName !== this._context.GetMainHq().PlayerName &&
			!(hq instanceof IaHeadquarter)
		);
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
		if (this.IsListenedHq(tank.Hq.GetCell().Coo())) {
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
		if (this.IsListenedHq(unit.Hq.GetCell().Coo())) {
			unit.SetCamouflage();
		}
	}

	private HandleNextCell(message: NetworkMessage<NextCellPacket>): void {
		const unit = this._context.GetUnit(message.Content.Id);
		const cell = this._context.GetCell(message.Content.Coo);

		if (this.IsListenedHq(unit.Hq.GetCell().Coo())) {
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
			reactor.StartLocked(FieldHelper.GetPowerUp(message.Content.PowerUp));
		}
	}
}
