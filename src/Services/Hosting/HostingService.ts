import { MapSetting } from '../../Components/Form/MapSetting';
import { HostState } from '../../Components/Network/HostState';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Player } from '../../Network/Player';
import { IHostingService } from './IHostingService';

export class HostingService implements IHostingService {
	private _hostState: HostState;

	Register(playerName: string, roomName: string, isAdmin: boolean): void {
		this._hostState = new HostState();
		this._hostState.MapSetting = new MapSetting();
		this._hostState.MapSetting.IaCount = 0;
		this._hostState.Player = new Player(playerName);
		this._hostState.Player.IsReady = false;
		this._hostState.Players = new Dictionnary<Player>();
		this._hostState.Players.Add(playerName, this._hostState.Player);
		this._hostState.RoomName = roomName;
		this._hostState.IsAdmin = isAdmin;
	}
	Publish(): HostState {
		return this._hostState;
	}

	Collect(): void {
		this._hostState = null;
	}
}
