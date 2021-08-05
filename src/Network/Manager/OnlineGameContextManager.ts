import { OnlineManager } from '../../Core/Framework/Network/OnlineManager';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { OnlineBlueprintMaker } from './OnlineBlueprintMaker';
import { ISocketWrapper } from './../Socket/INetworkSocket';
import { IOnlineGameContextManager } from './IOnlineGameContextManager';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { PacketKind } from '../Message/PacketKind';
import { route } from 'preact-router';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Singletons, SingletonKey } from '../../Singletons';
import { NetworkMessage } from '../Message/NetworkMessage';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { IGameworldService } from '../../Services/World/IGameworldService';
import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { BlueprintSetup } from '../../Components/Model/BlueprintSetup';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { BrainKind } from '../../Core/Ia/Decision/BrainKind';
export class OnlineGameContextManager implements IOnlineGameContextManager {
	private _peerObs: NetworkObserver[];
	private _onlineService: IOnlineService;
	private _gameworldService: IGameworldService<GameBlueprint, Gameworld>;

	constructor(
		private _socket: ISocketWrapper,
		private _onlinePlayerManager: IOnlinePlayerManager,
		private _blueprintSetup: BlueprintSetup,
		private _profilService: IPlayerProfileService
	) {
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._gameworldService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(SingletonKey.Gameworld);

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
			this.OverrideHqSettings(blueprint);
			this.Load(blueprint);
		}
	}

	private HandleBlueprint(data: NetworkMessage<GameBlueprint>): void {
		const blueprint = data.Content;
		this.OverrideHqSettings(blueprint);
		this.Load(blueprint);
	}
	private OverrideHqSettings(blueprint: GameBlueprint) {
		if (!this._onlinePlayerManager.Player.IsAdmin) {
			blueprint.Hqs.forEach((hq) => {
				const isPLayer = hq.Player.Name === this._onlinePlayerManager.Player.Name;
				hq.Player.IsPlayer = isPLayer;
				hq.Player.IA = isPLayer ? BrainKind.Truck : BrainKind.Dummy;
			});
		}
	}

	private Load(blueprint: GameBlueprint) {
		const appService = Singletons.Load<IBuilder<GameBlueprint>>(SingletonKey.GameBuilder);
		blueprint.PlayerName = this._onlinePlayerManager.Player.Name;
		appService.Register(blueprint, () => this._profilService.AddPoints(30), () => this._profilService.AddPoints(3));
		const context = this._gameworldService.Publish();
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
