import { LobbyManager } from './../../Network/Lobby/LobbyManager';
import { Lobby } from '../../Network/Lobby/Lobby';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Singletons, SingletonKey } from '../../Singletons';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { ILobbyService } from './ILobbyService';
import { ISocketService } from '../Socket/ISocketService';
import { ILobbyManager } from '../../Network/Lobby/ILobbyManager';

export class LobbyService implements ILobbyService {
	private _lobby: LobbyManager;

	public Register(
		playerName: string,
		roomName: string,
		password: string,
		hasPassword: boolean,
		isAdmin: boolean
	): void {
		const lobbyInfo = new Lobby();
		lobbyInfo.Name = roomName;
		lobbyInfo.Password = password;
		lobbyInfo.HasPassword = hasPassword;

		const player = new OnlinePlayer(playerName);
		player.IsReady = false;
		player.IsAdmin = isAdmin;

		const players = new Dictionnary<OnlinePlayer>();
		players.Add(playerName, player);

		const socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._lobby = new LobbyManager(socket, lobbyInfo, players, player);
		this.UpdatePlayerName(playerName);
	}
	private UpdatePlayerName(playerName: string) {
		const playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		playerProfilService.GetProfil().LastPlayerName = playerName;
		playerProfilService.Update();
	}

	Publish(): ILobbyManager {
		return this._lobby;
	}
	Collect(): void {
		this._lobby.Close();
	}
}
