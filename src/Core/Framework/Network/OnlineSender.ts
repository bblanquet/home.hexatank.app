import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { BlockingField } from '../../Items/Cell/Field/BlockingField';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { Item } from '../../Items/Item';
import { Tank } from '../../Items/Unit/Tank';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { GameContext } from '../Context/GameContext';
import { FieldHelper } from '../FieldTypeHelper';
import { ISocketWrapper } from '../../../Network/Socket/INetworkSocket';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { PacketKind } from '../../../Network/Message/PacketKind';
import { PeerSocket } from '../../../Network/Socket/Peer/PeerSocket';
import { NextCellContent } from './Contents/NextCellContent';
import { TargetContent } from './Contents/TargetContent';
import { PacketContent } from './Contents/PacketContent';
import { Identity } from '../../Items/Identity';

export class OnlineSender {
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
		if (!TypeTranslator.IsSpecialField(field) || this.IsEmiting(field.GetIdentity())) {
			const content = new PacketContent<any>();
			content.CId = c.Coo();
			content.Type = FieldHelper.GetName(field);
			content.Id = field.GetIdentity() ? field.GetIdentity().Name : '';
			if (field instanceof ReactorField && this.IsEmiting(field.GetIdentity())) {
				field.OnOverlocked.On(this.HandleOverlockChanged.bind(this));
				field.OnPowerChanged.On(this.HandlePowerChanged.bind(this));
			}
			const message = this.Wrap<PacketContent<any>>(PacketKind.FieldChanged, content);
			this._socket.Emit(message);
		}
	}

	private IsEmiting(id: Identity): boolean {
		const hq = this._context.GetHqFromId(id);
		return id.Name === this._context.GetPlayerHq().Identity.Name || hq.IsIa();
	}

	private HandleDestroyedField(source: any, item: Item): void {
		const blockingField = item as BlockingField;
		const message = this.Wrap<string>(PacketKind.FieldDestroyed, blockingField.GetCell().Coo());
		this._socket.Emit(message);
	}

	private HandleVehicleCreated(source: any, vehicle: Vehicle): void {
		if (this.IsEmiting(vehicle.Identity)) {
			if (vehicle instanceof Tank) {
				const tank = vehicle as Tank;
				tank.OnTargetChanged.On(this.HandleTargetChanged.bind(this));
				tank.OnCamouflageChanged.On(this.HandleCamouflageChanged.bind(this));
			}
			vehicle.OnDestroyed.On(this.HandleDestroyedVehicle.bind(this));
			vehicle.OnPathFound.On(this.HandlePathChanged.bind(this));
			vehicle.OnOrdered.On(this.HandlePathChanged.bind(this));
			vehicle.OnDestroyed.On(this.HandleVehicleDestroyed.bind(this));
			const message = this.Wrap<PacketContent<any>>(PacketKind.VehicleCreated, this.GetVContent(vehicle));
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
		const message = this.Wrap<string>(PacketKind.VehicleDestroyed, v.Id);
		this._socket.Emit(message);
	}

	private HandleTargetChanged(src: Tank, target: AliveItem): void {
		const targetPacket = new PacketContent<TargetContent>();
		targetPacket.Extra = new TargetContent();
		targetPacket.VId = src.Id;
		targetPacket.Id = src.Identity.Name;
		targetPacket.CId = src.GetCurrentCell().Coo();
		targetPacket.Extra.HasTarget = src.HasTarget();
		targetPacket.Extra.TargetCId = src.HasTarget() ? target.GetCurrentCell().Coo() : '';
		const message = this.Wrap<PacketContent<TargetContent>>(PacketKind.Target, targetPacket);
		this._socket.Emit(message);
	}

	private HandleCamouflageChanged(source: any, t: Tank): void {
		const message = this.Wrap<string>(PacketKind.Camouflage, t.Id);
		this._socket.Emit(message);
	}

	private HandleDestroyedVehicle(src: any, v: Vehicle): void {
		const message = this.Wrap<PacketContent<any>>(PacketKind.VehicleDestroyed, this.GetVContent(v));
		this._socket.Emit(message);
	}

	private HandlePathChanged(src: Vehicle, cell: Cell[]): void {
		const content = new PacketContent<NextCellContent>();
		content.Extra = new NextCellContent();
		content.Id = src.Identity.Name;
		content.VId = src.Id;
		content.CId = src.GetCurrentCell().Coo();
		content.Extra.NextCId = src.HasNextCell() ? src.GetNextCell().Coo() : '';
		content.Extra.Path = cell.map((c) => c.Coo());
		const message = this.Wrap<PacketContent<NextCellContent>>(PacketKind.PathChanged, content);
		this._socket.Emit(message);
	}

	private Wrap<T>(kind: PacketKind, content: T): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Recipient = PeerSocket.All();
		message.Emitter = this._context.GetPlayerHq().Identity.Name;
		message.Kind = kind;
		message.Content = content;
		return message;
	}

	private GetVContent(v: Vehicle): PacketContent<any> {
		const hq = this._context.GetHqFromId(v.Identity);
		const content = new PacketContent<any>();
		content.CId = v.GetCurrentCell().Coo();
		content.Id = hq.Identity.Name;
		content.VId = v.Id;
		content.Type = v instanceof Tank ? 'Tank' : 'Truck';
		return content;
	}

	private HandlePowerChanged(source: any, power: boolean): void {
		const reactor = source as ReactorField;
		const content = new PacketContent<boolean>();
		content.CId = reactor.GetCell().Coo();
		content.Extra = power;
		content.Id = reactor.Identity.Name;
		content.Type = 'ReactorField';
		const message = this.Wrap<PacketContent<boolean>>(PacketKind.PowerChanged, content);
		this._socket.Emit(message);
	}

	private HandleOverlockChanged(source: any, powerUp: string): void {
		const reactor = source as ReactorField;
		const packet = new PacketContent<string>();
		packet.CId = reactor.GetCell().Coo();
		packet.Extra = powerUp;
		packet.Id = reactor.Identity.Name;
		packet.Type = 'ReactorField';
		const message = this.Wrap<PacketContent<string>>(PacketKind.Overclocked, packet);
		this._socket.Emit(message);
	}
}
