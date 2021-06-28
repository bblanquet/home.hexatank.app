import { OnlineReceiver } from './OnlineReceiver';
import { ISocketWrapper } from '../../../Network/Socket/INetworkSocket';
import { GameContext } from '../../Framework/Context/GameContext';
import { IOnlinePlayerManager } from '../../../Network/Manager/IOnlinePlayerManager';
import { PacketKind } from '../../../Network/Message/PacketKind';
import { KindEventObserver } from '../../Utils/Events/KindEventObserver';
import { RuntimeBlueprint } from '../../Framework/Blueprint/RuntimeBlueprint';
import { GameSettings } from '../GameSettings';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { FieldHelper } from '../FieldTypeHelper';
import { Identity } from '../../Items/Identity';
import { PathResolver } from './PathResolver';

export class OnlineSync {
	private _obs: NetworkObserver[];
	private _handle: any = this.Handle.bind(this);
	private _pathResolver: PathResolver;

	constructor(
		private _socket: ISocketWrapper,
		private _receiver: OnlineReceiver,
		private _context: GameContext,
		private _players: IOnlinePlayerManager
	) {
		this._obs = [ new KindEventObserver(PacketKind.Sync, this.HandleSync.bind(this)) ];
		this._obs.forEach((obs) => {
			this._socket.OnReceived.On(obs);
		});
		this._players.OnConnectionChanged.On(this._handle);
		this._pathResolver = new PathResolver(this._context);
	}

	private HandleSync(src: any, blueprint: RuntimeBlueprint): void {
		blueprint.Cells.forEach((cellPrint) => {
			const cell = this._context.GetCell(cellPrint.CId);
			const field = cell.GetField();
			const fieldName = FieldHelper.GetName(field);
			if (fieldName !== cellPrint.Field) {
				FieldHelper.NewField(
					cellPrint.Field,
					cell,
					this._context.GetHqFromId(this.GetId(cellPrint.Id)),
					this._context
				);
			}
		});
		blueprint.Vehicles.forEach((vehiclePrint) => {
			const vehicle = this._context.GetVehicle(vehiclePrint.VId);
			if (!vehicle) {
				const hq = this._context.GetHqFromId(this.GetId(vehiclePrint.Id));
				const coo = this._context.GetCell(vehiclePrint.CId);
				if (vehiclePrint.Type === 'Tank') {
					hq.CreateTank(coo);
				} else if (vehiclePrint.Type === 'Truck') {
					hq.CreateTruck(coo);
				}
			}
			this._pathResolver.Resolve(vehicle, vehiclePrint.Path, vehiclePrint.CId, vehiclePrint.NextCId, 0);
		});
	}

	private GetId(id: string): Identity {
		return new Identity(id, null, null);
	}

	private Handle(src: any, isConnected: boolean): void {
		if (!isConnected) {
			GameSettings.IsSynchronizing = false;
		} else {
			if (!GameSettings.IsSynchronizing) {
				if (this._players.Player.IsAdmin) {
					const blueprint = RuntimeBlueprint.New(this._context);
					this._socket.EmitAll(PacketKind.Sync, blueprint);
				}
			}
		}
	}

	public Clear(): void {
		this._obs.forEach((ob) => {
			this._socket.OnReceived.Off(ob);
		});
		this._players.OnConnectionChanged.Off(this._handle);
	}
}
