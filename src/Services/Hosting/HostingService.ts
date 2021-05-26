import { MapSetting } from '../../Components/Form/MapSetting';
import { HostState } from '../../Components/Network/HostState';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Factory, FactoryKey } from '../../Factory';
import { Player } from '../../Network/Player';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { IHostingService } from './IHostingService';

export class HostingService implements IHostingService {
	private _hostState: HostState;

	public Register(
		playerName: string,
		roomName: string,
		password: string,
		hasPassword: boolean,
		isAdmin: boolean
	): void {
		this._hostState = new HostState();
		this._hostState.MapSetting = new MapSetting();
		this._hostState.MapSetting.IaCount = 0;
		this._hostState.Player = new Player(playerName);
		this._hostState.Player.IsReady = false;
		this._hostState.Players = new Dictionnary<Player>();
		this._hostState.Players.Add(playerName, this._hostState.Player);
		this._hostState.RoomName = roomName;
		this._hostState.Password = password;
		this._hostState.HasPassword = hasPassword;
		this._hostState.IsAdmin = isAdmin;
		this.UpdatePlayerName(playerName);
	}
	private UpdatePlayerName(playerName: string) {
		const playerProfilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
		playerProfilService.GetProfil().LastPlayerName = playerName;
		playerProfilService.Update();
	}

	Publish(): HostState {
		return this._hostState;
	}

	Collect(): void {
		this._hostState = null;
	}
}
