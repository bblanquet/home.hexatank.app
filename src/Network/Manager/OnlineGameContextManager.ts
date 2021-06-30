import { OnlineManager } from '../../Core/Framework/Network/OnlineManager';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { OnlineBlueprintMaker } from './OnlineBlueprintMaker';
import { ISocketWrapper } from './../Socket/INetworkSocket';
import { IOnlineGameContextManager } from './IOnlineGameContextManager';
import { IAppService } from '../../Services/App/IAppService';
import { NetworkObserver } from '../../Core/Utils/Events/NetworkObserver';
import { PacketKind } from '../Message/PacketKind';
import { route } from 'preact-router';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Singletons, SingletonKey } from '../../Singletons';
import { NetworkMessage } from '../Message/NetworkMessage';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { BlueprintSetup } from '../../UI/Components/Form/BlueprintSetup';
export class OnlineGameContextManager implements IOnlineGameContextManager {
	private _peerObs: NetworkObserver[];
	private _onlineService: IOnlineService;
	private _gameContextService: IGameContextService<GameBlueprint, GameContext>;

	constructor(
		private _socket: ISocketWrapper,
		private _onlinePlayerManager: IOnlinePlayerManager,
		private _blueprintSetup: BlueprintSetup
	) {
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._gameContextService = Singletons.Load<IGameContextService<GameBlueprint, GameContext>>(
			SingletonKey.GameContext
		);

		this._peerObs = [
			new NetworkObserver(PacketKind.Blueprint, this.HandleBlueprint.bind(this)),
			new NetworkObserver(PacketKind.Loaded, this.HandleLoaded.bind(this)),
			new NetworkObserver(PacketKind.Start, this.HandleStart.bind(this))
		];

		this._peerObs.forEach((obs) => {
			this._socket.OnReceived.On(obs);
		});
	}

	private HandleStart(data: NetworkMessage<any>): void {
		this.Clear();
		route('{{sub_path}}Canvas', true);
	}

	private HandleLoaded(data: NetworkMessage<boolean>): void {
		this._onlinePlayerManager.Players.Get(data.Emitter).IsLoaded = data.Content;
		if (
			this._onlinePlayerManager.Player.IsAdmin &&
			this._onlinePlayerManager.Players.Values().every((p) => p.IsLoaded)
		) {
			this._socket.EmitAll<any>(PacketKind.Start, {});
			route('{{sub_path}}Canvas', true);
		}
	}

	public Start(): void {
		if (this._onlinePlayerManager.Player.IsAdmin) {
			const dispatcher = new OnlineBlueprintMaker(this._onlinePlayerManager, this._blueprintSetup);
			const blueprint = dispatcher.GetBlueprint();
			this._socket.EmitAll<GameBlueprint>(PacketKind.Blueprint, blueprint);
			this.DisableIa(blueprint);
			this.Load(blueprint);
		}
	}

	private HandleBlueprint(data: NetworkMessage<GameBlueprint>): void {
		const blueprint = data.Content;
		blueprint.PlayerName = this._onlinePlayerManager.Player.Name;
		this.DisableIa(blueprint);
		this.Load(blueprint);
	}
	private DisableIa(blueprint: GameBlueprint) {
		if (!this._onlinePlayerManager.Player.IsAdmin) {
			blueprint.Hqs.forEach((hq) => {
				hq.isIa = false;
			});
		}
	}

	private Load(blueprint: GameBlueprint) {
		const appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App);
		appService.Register(blueprint);
		const context = this._gameContextService.Publish();
		this._onlineService.Publish(new OnlineManager(this._socket, context, this._onlinePlayerManager));
		this._onlinePlayerManager.Player.IsLoaded = true;
		this._socket.EmitAll<boolean>(PacketKind.Loaded, true);
	}

	Clear(): void {
		this._peerObs.forEach((obs) => {
			this._socket.OnReceived.Off(obs);
		});
	}
}
