import { route } from 'preact-router';
import { StateUpdater } from 'preact/hooks';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { ILobbyManager } from '../../Network/Manager/ILobbyManager';
import { IOnlinePlayerManager } from '../../Network/Manager/IOnlinePlayerManager';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { Singletons, SingletonKey } from '../../Singletons';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { Message } from '../Model/Message';
import { LobbyState } from '../Model/LobbyState';
import { Hook } from './Hook';
import { LobbyMode } from '../Model/LobbyMode';

export class LobbyHook extends Hook<LobbyState> {
	//SERVICE
	public LobbyManager: ILobbyManager;
	public OnlineManager: IOnlinePlayerManager;

	constructor(d: [LobbyState, StateUpdater<LobbyState>]) {
		super(d[0], d[1]);
		if (!SpriteProvider.IsLoaded()) {
			return;
		}
		const lobbyService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this.LobbyManager = lobbyService.GetLobbyManager();
		this.OnlineManager = lobbyService.GetOnlinePlayerManager();

		this.LobbyManager.OnKicked.On(this.Back.bind(this));
		this.LobbyManager.OnMessageReceived.On(this.OnMessage.bind(this));
		this.OnlineManager.OnPlayersChanged.On(this.UpdateState.bind(this));
		this.LobbyManager.OnStarting.On(() => {
			this.LobbyManager.Clear();
			route('{{sub_path}}Launching', true);
		});
	}

	static DefaultState(): LobbyState {
		const lobbyService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		const lob = lobbyService.GetLobbyManager();
		const online = lobbyService.GetOnlinePlayerManager();
		const state = new LobbyState();
		state.Players = online.Players;
		state.Player = online.Player;
		state.Messages = [];
		state.Message = '';
		state.MapSetting = lob.GetSetup();
		return state;
	}

	public UpdateState(src: any, players: Dictionary<OnlinePlayer>): void {
		this.SetProp((e) => {
			e.Players = players;
		});
	}

	public ChangeReady(): void {
		this.LobbyManager.SetReady();
	}

	public Back(): void {
		this.LobbyManager.Stop();
		route('{{sub_path}}Home', true);
	}

	public Launching(): void {
		this.LobbyManager.Start();
	}

	public Send(message: string): void {
		this.LobbyManager.SendMessage(message);
	}

	public SetMode(mode: LobbyMode): void {
		this.SetProp((e) => {
			e.Mode = mode;
		});
	}

	private OnMessage(source: any, message: Message): void {
		this.SetProp((e) => {
			e.Messages = [ message ].concat(e.Messages);
		});
	}

	public Unmount(): void {}
}
