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
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';

export class OnlineSync {
	private _obs: NetworkObserver[];
	private _handle: any = this.HandleConnection.bind(this);
	private _pathResolver: PathResolver;

	constructor(
		private _socket: ISocketWrapper,
		private _receiver: OnlineReceiver,
		private _context: GameContext,
		private _players: IOnlinePlayerManager
	) {
		this._obs = [
			new KindEventObserver(PacketKind.Blueprint, this.HandleBlueprint.bind(this)),
			new KindEventObserver(PacketKind.Loaded, this.HandleLoaded.bind(this)),
			new KindEventObserver(PacketKind.Start, this.HandleStart.bind(this))
		];
		this._obs.forEach((obs) => {
			this._socket.OnReceived.On(obs);
		});
		this._players.OnConnectionChanged.On(this._handle);
		this._pathResolver = new PathResolver(this._context);
	}

	private HandleBlueprint(message: NetworkMessage<RuntimeBlueprint>): void {
		if (GameSettings.IsSynchronizing) {
			GameSettings.IsSynchronizing = false;
		}

		message.Content.Cells.forEach((cellPrint) => {
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
		message.Content.Vehicles.forEach((vehiclePrint) => {
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
		this._socket.EmitAll(PacketKind.Loaded, {});
	}

	private HandleStart(message: NetworkMessage<any>): void {
		GameSettings.IsSynchronizing = true;
	}

	private HandleLoaded(message: NetworkMessage<any>): void {
		this._players.Players.Get(message.Emitter).IsSync = true;
		if (this._players.Player.IsAdmin && this._players.Players.Values().every((p) => p.IsSync)) {
			this._socket.EmitAll(PacketKind.Start, {});
			GameSettings.IsSynchronizing = true;
		}
	}

	private GetId(id: string): Identity {
		return new Identity(id, null, null);
	}

	private HandleConnection(src: any, isConnected: boolean): void {
		if (!isConnected) {
			GameSettings.IsSynchronizing = false;
		} else {
			if (!GameSettings.IsSynchronizing) {
				if (this._players.Player.IsAdmin) {
					this._players.Players.Values().forEach((player) => {
						if (player.IsAdmin) {
							player.IsSync = false;
						}
					});
					const blueprint = RuntimeBlueprint.New(this._context);
					this._socket.EmitAll(PacketKind.Blueprint, blueprint);
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
