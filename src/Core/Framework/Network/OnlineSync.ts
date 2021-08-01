import { ISocketWrapper } from '../../../Network/Socket/INetworkSocket';
import { GameContext } from '../../Framework/Context/GameContext';
import { IOnlinePlayerManager } from '../../../Network/Manager/IOnlinePlayerManager';
import { PacketKind } from '../../../Network/Message/PacketKind';
import { KindEventObserver } from '../../../Utils/Events/KindEventObserver';
import { RuntimeBlueprint } from '../../Framework/Blueprint/RuntimeBlueprint';
import { NetworkObserver } from '../../../Utils/Events/NetworkObserver';
import { FieldHelper } from '../FieldTypeHelper';
import { Identity } from '../../Items/Identity';
import { PathResolver } from './PathResolver';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';

export class OnlineSync {
	private _obs: NetworkObserver[];
	private _handle: any = this.HandleConnection.bind(this);
	private _pathResolver: PathResolver;

	constructor(
		private _socket: ISocketWrapper,
		private _context: GameContext,
		private _players: IOnlinePlayerManager
	) {
		this._obs = [
			new KindEventObserver(PacketKind.SyncBlueprint, this.HandleBlueprint.bind(this)),
			new KindEventObserver(PacketKind.SyncLoaded, this.HandleLoaded.bind(this)),
			new KindEventObserver(PacketKind.SyncStart, this.HandleStart.bind(this))
		];
		this._obs.forEach((obs) => {
			this._socket.OnReceived.On(obs);
		});
		this._players.OnPlayersChanged.On(this._handle);
		this._pathResolver = new PathResolver(this._context);
	}

	private HandleBlueprint(message: NetworkMessage<RuntimeBlueprint>): void {
		this.SetUnsync();
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
		this._socket.EmitAll(PacketKind.SyncLoaded, {});
	}

	private HandleStart(message: NetworkMessage<any>): void {
		this._context.State.IsPause = false;
		this._players.Players.Values().forEach((player) => {
			player.SetSync(true);
		});
	}

	private HandleLoaded(message: NetworkMessage<any>): void {
		this._players.Players.Get(message.Emitter).SetSync(true);
		if (this._players.Player.IsAdmin && this._players.IsSync()) {
			this._socket.EmitAll(PacketKind.SyncStart, {});
			this._context.State.IsPause = false;
		}
	}

	private GetId(id: string): Identity {
		return new Identity(id, null, null);
	}

	private HasConnectionIssue(): boolean {
		return this._players.Players.Values().some((p) => p.HasTimeOut());
	}

	private HandleConnection(src: any, players: Dictionary<OnlinePlayer>): void {
		if (this.HasConnectionIssue() && this._players.IsSync()) {
			this.SetUnsync();
		} else if (!this.HasConnectionIssue() && !this._players.IsSync()) {
			if (this._players.Player.IsAdmin) {
				const blueprint = RuntimeBlueprint.New(this._context);
				this._socket.EmitAll(PacketKind.SyncBlueprint, blueprint);
			}
		}
	}

	private SetUnsync() {
		this._context.State.IsPause = true;
		this._players.Players.Values().forEach((player) => {
			if (player.Name !== this._players.Player.Name) {
				player.SetSync(false);
			}
		});
	}

	public Clear(): void {
		this._obs.forEach((ob) => {
			this._socket.OnReceived.Off(ob);
		});
		this._players.OnPlayersChanged.Off(this._handle);
	}
}
