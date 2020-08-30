import { FieldTypeHelper } from './Packets/FieldTypeHelper';
import { NextCellPacket } from './Packets/NextCellPacket';
import { TargetPacket } from './Packets/TargetPacket';
import { PacketKind } from './../../Network/Message/PacketKind';
import { NetworkMessage } from './../../Network/Message/NetworkMessage';
import { NetworkSocket } from './../../Network/NetworkSocket';
import { GameContext } from './GameContext';
import { Vehicle } from '../Items/Unit/Vehicle';
import { Cell } from '../Items/Cell/Cell';
import { PeerSocket } from '../../Network/Peer/PeerSocket';
import { Tank } from '../Items/Unit/Tank';
import { CreatingUnitPacket } from './Packets/CreatingUnitPacket';
import { FieldPacket } from './Packets/FieldPacket';
import { BonusField } from '../Items/Cell/Field/Bonus/BonusField';

export class NetworkDispatcher {
	public constructor(private _gameContext: GameContext, private _socket: NetworkSocket) {
		this._gameContext.GetCells().forEach((cell) => {
			cell.OnFieldChanged.On(this.HandleChangedField.bind(this));
		});

		this._gameContext.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});
	}

	private HandleChangedField(source: any, c: Cell): void {
		const field = c.GetField();
		const fieldPacket = new FieldPacket();
		fieldPacket.Coo = c.Coo();
		fieldPacket.Type = FieldTypeHelper.GetDescription(field);
		if (field instanceof BonusField) {
			fieldPacket.HqCoo = field.GetHq().GetCell().Coo();
		}
		const message = this.Message<FieldPacket>(PacketKind.FieldChanged, fieldPacket);
		this._socket.Emit(message);
	}

	private HandleVehicleCreated(source: any, v: Vehicle): void {
		if (v instanceof Tank) {
			const tank = v as Tank;
			tank.OnTargetChanged.On(this.HandleTargetChanged.bind(this));
			tank.OnCamouflageChanged.On(this.HandleCamouflageChanged.bind(this));
		}
		v.OnNextCellChanged.On(this.HandleNextCellChanged.bind(this));
		v.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
		const message = this.Message<CreatingUnitPacket>(PacketKind.UnitCreated, this.GetCreatingUnitMessage(v));
		this._socket.Emit(message);
	}

	private HandleVehicleDestroyed(source: any, v: Vehicle) {
		if (v instanceof Tank) {
			const tank = v as Tank;
			tank.OnTargetChanged.Clear();
			tank.OnCamouflageChanged.Clear();
			tank.OnNextCellChanged.Clear();
		}
		const message = this.Message<string>(PacketKind.UnitDestroyed, v.Id);
		this._socket.Emit(message);
	}

	private HandleTargetChanged(source: any, t: Tank): void {
		const targetPacket = new TargetPacket();
		targetPacket.Id = t.Id;
		targetPacket.TagertCoo = t.GetMainTarget().GetCurrentCell().Coo();
		const message = this.Message<TargetPacket>(PacketKind.Target, targetPacket);
		this._socket.Emit(message);
	}

	private HandleCamouflageChanged(source: any, t: Tank): void {
		const message = this.Message<string>(PacketKind.Camouflage, t.Id);
		this._socket.Emit(message);
	}

	private HandleNextCellChanged(source: any, t: Vehicle): void {
		const content = new NextCellPacket();
		content.Id = t.Id;
		content.Coo = t.GetNextCell().Coo();
		const message = this.Message<NextCellPacket>(PacketKind.NextCell, content);
		this._socket.Emit(message);
	}

	private Message<T>(kind: PacketKind, content: T): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Recipient = PeerSocket.All();
		message.Emitter = this._gameContext.GetMainHq().PlayerName;
		message.Kind = kind;
		message.Content = content;
		return message;
	}

	private GetCreatingUnitMessage(v: Vehicle) {
		const content = new CreatingUnitPacket();
		content.Coo = v.GetCurrentCell().Coo();
		content.HqCoo = v.Hq.GetCell().Coo();
		content.Id = v.Id;
		content.Kind = v instanceof Tank ? 'Tank' : 'Truck';
		return content;
	}
}
