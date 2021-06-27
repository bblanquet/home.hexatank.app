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
import { BasicOrder } from '../../Ia/Order/BasicOrder';

export class OnlineSync {
	private _obs: NetworkObserver[];
	private _handle: any = this.Handle.bind(this);

	constructor(
		private _socket: ISocketWrapper,
		private _receiver: OnlineReceiver,
		private _gameContext: GameContext,
		private _players: IOnlinePlayerManager
	) {
		this._obs = [ new KindEventObserver(PacketKind.Sync, this.HandleSync.bind(this)) ];
		this._obs.forEach((obs) => {
			this._socket.OnReceived.On(obs);
		});
		this._players.OnConnectionChanged.On(this._handle);
	}

	private HandleSync(src: any, blueprint: RuntimeBlueprint): void {
		blueprint.Cells.forEach((cellPrint) => {
			const cell = this._gameContext.GetCell(cellPrint.CId);
			const field = cell.GetField();
			const fieldName = FieldHelper.GetName(field);
			if (fieldName !== cellPrint.Field) {
				FieldHelper.NewField(
					cellPrint.Field,
					cell,
					this._gameContext.GetHqFromId(this.GetId(cellPrint.Id)),
					this._gameContext
				);
			}
		});
		blueprint.Vehicles.forEach((vehiclePrint) => {
			const vehicle = this._gameContext.GetVehicle(vehiclePrint.VId);
			if (!vehicle) {
				const hq = this._gameContext.GetHqFromId(this.GetId(vehiclePrint.Id));
				const coo = this._gameContext.GetCell(vehiclePrint.CId);
				if (vehiclePrint.Type === 'Tank') {
					hq.CreateTank(coo);
				} else if (vehiclePrint.Type === 'Truck') {
					hq.CreateTruck(coo);
				}
			}
			const cell = this._gameContext.GetCell(vehiclePrint.CId);
			const path = vehiclePrint.Path.map((coo) => this._gameContext.GetCell(coo));
			if (path && 0 < path.length) {
				vehicle.ForceCell(cell, new BasicOrder(vehicle, path));
			} else {
				vehicle.ForceCell(cell);
			}
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
					const blueprint = RuntimeBlueprint.New(this._gameContext);
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
