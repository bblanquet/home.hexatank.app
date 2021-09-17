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
import { Hook } from '../Framework/Hook';
import { LobbyMode } from '../Model/LobbyMode';

export class LobbyHook extends Hook<LobbyState> {
	//SERVICE
	public LobbyManager: ILobbyManager;
	public onlinePlayers: IOnlinePlayerManager;
	private _onlineService: IOnlineService;
	private _back: any = this.Back.bind(this);
	private _message: any = this.OnMessage.bind(this);
	private _update: any = this.UpdatePlayers.bind(this);
	private _updateList: any = this.UpdatePlayerList.bind(this);
	private _start: any = this.Start.bind(this);

	constructor(d: [LobbyState, StateUpdater<LobbyState>]) {
		super(d[0], d[1]);
		if (!SpriteProvider.IsLoaded()) {
			return;
		}
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this.LobbyManager = this._onlineService.GetLobbyManager();
		this.onlinePlayers = this._onlineService.GetOnlinePlayerManager();

		this.LobbyManager.OnKicked.On(this._back);
		this.LobbyManager.OnMessageReceived.On(this._message);
		this.onlinePlayers.OnPlayersChanged.On(this._update);
		this.onlinePlayers.OnPlayerList.On(this._updateList);
		this.LobbyManager.OnStarting.On(this._start);
	}

	public Start(): void {
		this.LobbyManager.Clear();
		route('{{sub_path}}Launching', true);
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

		this.Update((e) => {
			e.Players = players;
		});

		if (this.IsReady() && !this.State.Timing) {
			this.Timer(6);
		}
	}

	public UpdatePlayerList(): void {
		this.LobbyManager.SendReadyState();
	}

	private Timer(nextDuration: number) {
		this.Update((e) => {
			e.Duration = nextDuration;
			e.Timing = true;
		});
		if (nextDuration === 0 && this.IsReady()) {
			this.LobbyManager.Start();
		} else if (this.IsReady()) {
			setTimeout(() => {
				this.Timer(Math.round(nextDuration - 1));
			}, 1000);
		} else {
			this.Update((e) => {
				e.Timing = false;
			});
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
		this.Update((e) => {
			e.Mode = mode;
			if (mode === LobbyMode.chat) {
				e.HasReceivedMessage = false;
			}
		});
	}

	private OnMessage(source: any, message: Message): void {
		this.Update((e) => {
			e.Messages = [ message ].concat(e.Messages);
		});
		if (this.State.Mode !== LobbyMode.chat) {
			this.Update((e) => {
				e.HasReceivedMessage = true;
			});
		}
	}

	public Unmount(): void {
		this.LobbyManager.OnKicked.Off(this._back);
		this.LobbyManager.OnMessageReceived.Off(this._message);
		this.onlinePlayers.OnPlayersChanged.Off(this._update);
		this.onlinePlayers.OnPlayerList.Off(this._updateList);
		this.LobbyManager.OnStarting.Off(this._start);
	}
}
