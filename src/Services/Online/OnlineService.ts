import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';
import { ISocketWrapper } from '../../Network/Socket/INetworkSocket';
import { OnlinePlayerManager } from '../../Network/Manager/OnlinePlayerManager';
import { IOnlinePlayerManager } from '../../Network/Manager/IOnlinePlayerManager';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { Singletons, SingletonKey } from '../../Singletons';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IPlayerProfileService } from '../PlayerProfil/IPlayerProfileService';
import { IOnlineService } from './IOnlineService';
import { ISocketService } from '../Socket/ISocketService';
import { ILobbyManager } from '../../Network/Manager/ILobbyManager';
import { LobbyManager } from '../../Network/Manager/LobbyManager';
import { Lobby } from '../../Network/Manager/Lobby';
import { SocketWrapper } from '../../Network/Socket/SocketWrapper';
import { OnlineGameContextManager } from '../../Network/Manager/OnlineGameContextManager';
import { IOnlineGameContextManager } from '../../Network/Manager/IOnlineGameContextManager';
import { OnlineManager } from '../../Core/Framework/Network/OnlineManager';
import { BlueprintSetup } from '../../Components/Model/BlueprintSetup';

export class OnlineService implements IOnlineService {
	private _servSocket: IServerSocket;
	private _socketWrapper: ISocketWrapper;
	private _lobbyManager: ILobbyManager;
	private _onlineGameContext: IOnlineGameContextManager;
	private _onlinePlayerManager: IOnlinePlayerManager;
	private _runtime: OnlineManager;

	public Register(playerName: string, roomName: string, password: string | undefined, isAdmin: boolean): void {
		const blueprintSetup = new BlueprintSetup();

		const lobbyInfo = new Lobby();
		lobbyInfo.Name = roomName;
		lobbyInfo.Password = password;

		const player = new OnlinePlayer(playerName);
		player.IsReady = false;
		player.IsAdmin = isAdmin;

		const players = new Dictionary<OnlinePlayer>();
		players.Add(playerName, player);

		this._servSocket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._socketWrapper = new SocketWrapper(this._servSocket, roomName, player.Name, player.IsAdmin);

		this._onlinePlayerManager = new OnlinePlayerManager(this._servSocket, this._socketWrapper, player, players);
		this._lobbyManager = new LobbyManager(
			this._servSocket,
			this._socketWrapper,
			this._onlinePlayerManager,
			lobbyInfo,
			blueprintSetup
		);
		this._onlineGameContext = new OnlineGameContextManager(
			this._socketWrapper,
			this._onlinePlayerManager,
			blueprintSetup,
			Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil)
		);
		this.UpdatePlayerName(playerName);
	}
	private UpdatePlayerName(playerName: string) {
		const playerProfilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		playerProfilService.GetProfile().LastPlayerName = playerName;
		playerProfilService.Save();
	}

	IsOnline(): boolean {
		return this._onlinePlayerManager !== null && this._onlinePlayerManager !== undefined;
	}

	GetLobbyManager(): ILobbyManager {
		return this._lobbyManager;
	}

	GetOnlinePlayerManager(): IOnlinePlayerManager {
		return this._onlinePlayerManager;
	}

	GetOnlineGameContextManager(): IOnlineGameContextManager {
		return this._onlineGameContext;
	}

	Publish(runtime: OnlineManager): void {
		this._runtime = runtime;
	}

	Collect(): void {
		if (this._onlinePlayerManager) {
			this._onlinePlayerManager.Clear();
			this._onlinePlayerManager = null;
		}
		if (this._lobbyManager) {
			this._lobbyManager.Clear();
			this._lobbyManager = null;
		}
		if (this._onlineGameContext) {
			this._onlineGameContext.Clear();
			this._onlineGameContext = null;
		}
		if (this._runtime) {
			this._runtime.Clear();
			this._runtime = null;
		}
		if (this._socketWrapper) {
			this._socketWrapper.Stop();
			this._socketWrapper = null;
		}

		Singletons.Load<ISocketService>(SingletonKey.Socket).Collect();
	}
}
