import { FieldHelper } from './../Items/Cell/Field/FieldHelper';
import { isNullOrUndefined } from 'util';
import { Headquarter } from './../Items/Cell/Field/Hq/Headquarter';
import { PowerFieldPacket } from './Packets/PowerFieldPacket';
import { OverlockedPacket } from './Packets/OverlockedPacket';
import { ShieldField } from './../Items/Cell/Field/Bonus/ShieldField';
import { ReactorField } from './../Items/Cell/Field/Bonus/ReactorField';
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
import { AliveItem } from '../Items/AliveItem';
import { IaHeadquarter } from '../Ia/IaHeadquarter';

export class NetworkDispatcher {
	public constructor(private _context: GameContext, private _socket: NetworkSocket) {
		this._context.GetCells().forEach((cell) => {
			cell.OnFieldChanged.On(this.HandleChangedField.bind(this));
		});

		this._context.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
		});
	}

	private HandleChangedField(source: any, c: Cell): void {
		const field = c.GetField();
		if (!FieldHelper.IsSpecialField(field) || this.IsSpeakingHq(FieldHelper.GetHq(field))) {
			const fieldPacket = new FieldPacket();
			fieldPacket.Coo = c.Coo();
			fieldPacket.Type = FieldTypeHelper.GetDescription(field);
			if (field instanceof BonusField) {
				fieldPacket.HqCoo = field.GetHq().GetCell().Coo();
			} else if (field instanceof ReactorField) {
				fieldPacket.HqCoo = field.GetHq().GetCell().Coo();
				if (this.IsSpeakingHq(field.GetHq())) {
					field.Overlocked.On(this.HandleOverlockChanged.bind(this));
					field.PowerChanged.On(this.HandlePowerChanged.bind(this));
				}
			} else if (field instanceof ShieldField) {
				fieldPacket.HqCoo = field.GetHq().GetCell().Coo();
			}
			const message = this.Message<FieldPacket>(PacketKind.FieldChanged, fieldPacket);
			this._socket.Emit(message);
		}
	}

	private IsSpeakingHq(hq: Headquarter): boolean {
		return hq.PlayerName === this._context.GetMainHq().PlayerName || hq instanceof IaHeadquarter;
	}

	private HandleVehicleCreated(source: any, vehicle: Vehicle): void {
		if (this.IsSpeakingHq(vehicle.Hq)) {
			if (vehicle instanceof Tank) {
				const tank = vehicle as Tank;
				tank.OnTargetChanged.On(this.HandleTargetChanged.bind(this));
				tank.OnCamouflageChanged.On(this.HandleCamouflageChanged.bind(this));
			}
			vehicle.OnNextCellChanged.On(this.HandleNextCellChanged.bind(this));
			vehicle.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
			const message = this.Message<CreatingUnitPacket>(
				PacketKind.UnitCreated,
				this.GetCreatingUnitMessage(vehicle)
			);
			this._socket.Emit(message);
		}
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

	private HandleTargetChanged(source: any, target: AliveItem): void {
		const targetPacket = new TargetPacket();
		if (source instanceof Vehicle) {
			targetPacket.Id = source.Id;
		}
		targetPacket.HasTarget = !isNullOrUndefined(target);
		if (!isNullOrUndefined(target)) {
			targetPacket.TagertCoo = target.GetCurrentCell().Coo();
		}
		const message = this.Message<TargetPacket>(PacketKind.Target, targetPacket);
		this._socket.Emit(message);
	}

	private HandleCamouflageChanged(source: any, t: Tank): void {
		const message = this.Message<string>(PacketKind.Camouflage, t.Id);
		this._socket.Emit(message);
	}

	private HandleNextCellChanged(source: Vehicle, cell: Cell): void {
		const content = new NextCellPacket();
		content.Id = source.Id;
		content.Coo = cell.Coo();
		const message = this.Message<NextCellPacket>(PacketKind.NextCell, content);
		this._socket.Emit(message);
	}

	private Message<T>(kind: PacketKind, content: T): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Recipient = PeerSocket.All();
		message.Emitter = this._context.GetMainHq().PlayerName;
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

	private HandlePowerChanged(source: any, power: boolean): void {
		const reactor = source as ReactorField;
		const packet = new PowerFieldPacket();
		packet.Coo = reactor.GetCell().Coo();
		packet.Power = power;
		packet.HqCoo = reactor.Hq.GetCell().Coo();
		packet.Type = 'ReactorField';
		const message = this.Message<PowerFieldPacket>(PacketKind.PowerChanged, packet);
		this._socket.Emit(message);
	}

	private HandleOverlockChanged(source: any, powerUp: string): void {
		const reactor = source as ReactorField;
		const packet = new OverlockedPacket();
		packet.Coo = reactor.GetCell().Coo();
		packet.PowerUp = powerUp;
		packet.HqCoo = reactor.Hq.GetCell().Coo();
		packet.Type = 'ReactorField';
		const message = this.Message<OverlockedPacket>(PacketKind.Overlocked, packet);
		this._socket.Emit(message);
	}
}