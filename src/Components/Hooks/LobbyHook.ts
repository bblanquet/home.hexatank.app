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
	public onlinePlayers: IOnlinePlayerManager;
	private _onlineService: IOnlineService;

	constructor(d: [LobbyState, StateUpdater<LobbyState>]) {
		super(d[0], d[1]);
		if (!SpriteProvider.IsLoaded()) {
			return;
		}
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this.LobbyManager = this._onlineService.GetLobbyManager();
		this.onlinePlayers = this._onlineService.GetOnlinePlayerManager();

		this.LobbyManager.OnKicked.On(this.Back.bind(this));
		this.LobbyManager.OnMessageReceived.On(this.OnMessage.bind(this));
		this.onlinePlayers.OnPlayersChanged.On(this.UpdatePlayers.bind(this));
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

	public UpdatePlayers(src: any, players: Dictionary<OnlinePlayer>): void {
		if (!players.Exist(this.State.Player.Name)) {
			this.Back();
			return;
		}

		this.SetProp((e) => {
			e.Players = players;
		});

		if (this.IsReady()) {
			this.LobbyManager.Start();
		}
	}

	public ChangeReady(): void {
		this.LobbyManager.SetReady();
	}

	public Back(): void {
		this.LobbyManager.Stop();
		this._onlineService.Collect();
		route('{{sub_path}}Home', true);
	}

	public IsReady(): boolean {
		const players = this.State.Players.Values();
		return 2 <= players.length && players.every((e) => e.IsReady);
	}

	public Send(message: string): void {
		this.LobbyManager.SendMessage(message);
	}

	public SetMode(mode: LobbyMode): void {
		this.SetProp((e) => {
			e.Mode = mode;
			if (mode === LobbyMode.chat) {
				e.HasReceivedMessage = false;
			}
		});
	}

	private OnMessage(source: any, message: Message): void {
		this.SetProp((e) => {
			e.Messages = [ message ].concat(e.Messages);
		});
		if (this.State.Mode !== LobbyMode.chat) {
			this.SetProp((e) => {
				e.HasReceivedMessage = true;
			});
		}
	}

	public Unmount(): void {
		this.LobbyManager.OnKicked.Off(this.Back.bind(this));
		this.LobbyManager.OnMessageReceived.Off(this.OnMessage.bind(this));
		this.onlinePlayers.OnPlayersChanged.Off(this.UpdatePlayers.bind(this));
	}
}
