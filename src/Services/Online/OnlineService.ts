import { BlueprintSetup } from './../../Components/Form/BlueprintSetup';
import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';
import { ISocketWrapper } from '../../Network/Socket/INetworkSocket';
import { OnlinePlayerManager } from '../../Network/Manager/OnlinePlayerManager';
import { IOnlinePlayerManager } from '../../Network/Manager/IOnlinePlayerManager';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Singletons, SingletonKey } from '../../Singletons';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { IOnlineService } from './IOnlineService';
import { ISocketService } from '../Socket/ISocketService';
import { ILobbyManager } from '../../Network/Manager/ILobbyManager';
import { LobbyManager } from '../../Network/Manager/LobbyManager';
import { Lobby } from '../../Network/Manager/Lobby';
import { SocketWrapper } from '../../Network/Socket/SocketWrapper';
import { OnlineGameContextManager } from '../../Network/Manager/OnlineGameContextManager';
import { IOnlineGameContextManager } from '../../Network/Manager/IOnlineGameContextManager';
import { OnlineRuntimeManager } from '../../Core/Framework/OnlineRuntimeManager';

export class OnlineService implements IOnlineService {
	private _servSocket: IServerSocket;
	private _socketWrapper: ISocketWrapper;
	private _lobbyManager: ILobbyManager;
	private _onlineGameContext: IOnlineGameContextManager;
	private _onlinePlayerManager: IOnlinePlayerManager;
	private _runtime: OnlineRuntimeManager;

	public Register(
		playerName: string,
		roomName: string,
		password: string,
		hasPassword: boolean,
		isAdmin: boolean
	): void {
		const blueprintSetup = new BlueprintSetup();

		const lobbyInfo = new Lobby();
		lobbyInfo.Name = roomName;
		lobbyInfo.Password = password;
		lobbyInfo.HasPassword = hasPassword;

		const player = new OnlinePlayer(playerName);
		player.IsReady = false;
		player.IsAdmin = isAdmin;

		const players = new Dictionnary<OnlinePlayer>();
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
			blueprintSetup
		);
		this.UpdatePlayerName(playerName);
	}
	private UpdatePlayerName(playerName: string) {
		const playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		playerProfilService.GetProfil().LastPlayerName = playerName;
		playerProfilService.Update();
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

	Publish(runtime: OnlineRuntimeManager): void {
		this._runtime = runtime;
	}

	Collect(): void {
		this._onlinePlayerManager.Clear();
		this._lobbyManager.Clear();
		this._onlineGameContext.Clear();
		if (this._runtime) {
			this._runtime.Clear();
		}

		this._onlinePlayerManager = null;
		this._lobbyManager = null;
		this._onlineGameContext = null;
		this._runtime = null;

		Singletons.Load<ISocketService>(SingletonKey.Socket).Collect();
	}
}
