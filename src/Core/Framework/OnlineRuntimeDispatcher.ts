import { ISocketWrapper } from '../../Network/Socket/INetworkSocket';
import { TypeTranslator } from '../Items/Cell/Field/TypeTranslator';
import { EnergyPacket } from './Packets/PowerFieldPacket';
import { OverlockedPacket } from './Packets/OverlockedPacket';
import { ShieldField } from '../Items/Cell/Field/Bonus/ShieldField';
import { ReactorField } from '../Items/Cell/Field/Bonus/ReactorField';
import { FieldTypeHelper } from './Packets/FieldTypeHelper';
import { NextCellPacket } from './Packets/NextCellPacket';
import { TargetPacket } from './Packets/TargetPacket';
import { PacketKind } from '../../Network/Message/PacketKind';
import { NetworkMessage } from '../../Network/Message/NetworkMessage';
import { GameContext } from '../Setup/Context/GameContext';
import { Vehicle } from '../Items/Unit/Vehicle';
import { Cell } from '../Items/Cell/Cell';
import { PeerSocket } from '../../Network/Socket/Peer/PeerSocket';
import { Tank } from '../Items/Unit/Tank';
import { VehiclePacket } from './Packets/CreatingUnitPacket';
import { FieldPacket } from './Packets/FieldPacket';
import { BonusField } from '../Items/Cell/Field/Bonus/BonusField';
import { AliveItem } from '../Items/AliveItem';
import { isNullOrUndefined } from '../Utils/ToolBox';
import { IHeadquarter } from '../Items/Cell/Field/Hq/IHeadquarter';
import { BlockingField } from '../Items/Cell/Field/BlockingField';
import { Item } from '../Items/Item';

export class OnlineRuntimeDispatcher {
	private _handleField: any = this.HandleChangedField.bind(this);
	private _handleVehicle: any = this.HandleVehicleCreated.bind(this);
	private _handleDestroyedField: any = this.HandleDestroyedField.bind(this);

	public constructor(private _socket: ISocketWrapper, private _context: GameContext) {
		this._context.GetCells().forEach((cell) => {
			cell.OnFieldChanged.On(this._handleField);
			if (cell.GetField() instanceof BlockingField) {
				(cell.GetField() as BlockingField).OnDestroyed.On(this._handleDestroyedField);
			}
		});

		this._context.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.On(this._handleVehicle);
		});
	}

	public Clear(): void {
		this._context.GetCells().forEach((cell) => {
			cell.OnFieldChanged.Off(this._handleField);
		});

		this._context.GetHqs().forEach((hq) => {
			hq.OnVehicleCreated.Off(this._handleVehicle);
		});
	}

	private HandleChangedField(source: any, c: Cell): void {
		const field = c.GetField();
		if (
			!TypeTranslator.IsSpecialField(field) ||
			this.IsListenedHq(this._context.GetHqFromId(field.GetIdentity()))
		) {
			const fieldPacket = new FieldPacket();
			fieldPacket.Coo = c.Coo();
			fieldPacket.Type = FieldTypeHelper.GetDescription(field);
			if (field instanceof BonusField) {
				fieldPacket.IdentityName = field.Identity.Name;
			} else if (field instanceof ReactorField) {
				fieldPacket.IdentityName = field.Identity.Name;
				if (this.IsListenedHq(field.GetHq())) {
					field.OnOverlocked.On(this.HandleOverlockChanged.bind(this));
					field.OnPowerChanged.On(this.HandlePowerChanged.bind(this));
				}
			} else if (field instanceof ShieldField) {
				fieldPacket.IdentityName = field.Identity.Name;
			}
			const message = this.Message<FieldPacket>(PacketKind.FieldChanged, fieldPacket);
			this._socket.Emit(message);
		}
	}

	private IsListenedHq(hq: IHeadquarter): boolean {
		return hq.Identity.Name === this._context.GetPlayerHq().Identity.Name || hq.IsIa();
	}

	private HandleDestroyedField(source: any, item: Item): void {
		const blockingField = item as BlockingField;
		const message = this.Message<string>(PacketKind.FieldDestroyed, blockingField.GetCell().Coo());
		this._socket.Emit(message);
	}

	private HandleVehicleCreated(source: any, vehicle: Vehicle): void {
		const hq = this._context.GetHqFromId(vehicle.Identity);
		if (this.IsListenedHq(hq)) {
			if (vehicle instanceof Tank) {
				const tank = vehicle as Tank;
				tank.OnTargetChanged.On(this.HandleTargetChanged.bind(this));
				tank.OnCamouflageChanged.On(this.HandleCamouflageChanged.bind(this));
			}
			vehicle.OnDestroyed.On(this.HandleDestroyedVehicle.bind(this));
			vehicle.OnPathFound.On(this.HandlePathChanged.bind(this));
			vehicle.OnOrdered.On(this.HandlePathChanged.bind(this));
			vehicle.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
			const message = this.Message<VehiclePacket>(PacketKind.VehicleCreated, this.GetVehiclePacket(vehicle));
			this._socket.Emit(message);
		}
	}

	private HandleVehicleDestroyed(source: any, v: Vehicle) {
		if (v instanceof Tank) {
			const tank = v as Tank;
			tank.OnTargetChanged.Clear();
			tank.OnCamouflageChanged.Clear();
			tank.OnOrdering.Clear();
			tank.OnNextCellChanged.Clear();
		}
		const message = this.Message<string>(PacketKind.VehicleDestroyed, v.Id);
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

	private HandleDestroyedVehicle(src: any, v: Vehicle): void {
		const message = this.Message<VehiclePacket>(PacketKind.VehicleDestroyed, this.GetVehiclePacket(v));
		this._socket.Emit(message);
	}

	private HandlePathChanged(source: Vehicle, cell: Cell[]): void {
		const content = new NextCellPacket();
		content.Id = source.Id;
		content.CC = source.GetCurrentCell().Coo();
		if (source.GetNextCell()) {
			content.NC = source.GetNextCell().Coo();
		} else {
			content.NC = '';
		}
		content.Path = cell.map((c) => c.Coo());
		const message = this.Message<NextCellPacket>(PacketKind.PathChanged, content);
		this._socket.Emit(message);
	}

	private Message<T>(kind: PacketKind, content: T): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Recipient = PeerSocket.All();
		message.Emitter = this._context.GetPlayerHq().Identity.Name;
		message.Kind = kind;
		message.Content = content;
		return message;
	}

	private GetVehiclePacket(v: Vehicle) {
		const hq = this._context.GetHqFromId(v.Identity);
		const content = new VehiclePacket();
		content.Coo = v.GetCurrentCell().Coo();
		content.HqName = hq.Identity.Name;
		content.Id = v.Id;
		content.Kind = v instanceof Tank ? 'Tank' : 'Truck';
		return content;
	}

	private HandlePowerChanged(source: any, power: boolean): void {
		const reactor = source as ReactorField;
		const packet = new EnergyPacket();
		packet.Coo = reactor.GetCell().Coo();
		packet.IsEnergyUp = power;
		packet.IdentityName = reactor.Identity.Name;
		packet.Type = 'ReactorField';
		const message = this.Message<EnergyPacket>(PacketKind.PowerChanged, packet);
		this._socket.Emit(message);
	}

	private HandleOverlockChanged(source: any, powerUp: string): void {
		const reactor = source as ReactorField;
		const packet = new OverlockedPacket();
		packet.Coo = reactor.GetCell().Coo();
		packet.PowerUp = powerUp;
		packet.IdentityName = reactor.Identity.Name;
		packet.Type = 'ReactorField';
		const message = this.Message<OverlockedPacket>(PacketKind.Overlocked, packet);
		this._socket.Emit(message);
	}
}
