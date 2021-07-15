import { IOnlinePlayerManager } from '../../Network/Manager/IOnlinePlayerManager';
import { ILobbyManager } from '../../Network/Manager/ILobbyManager';
import { IGarbage } from '../IGarbage';
import { OnlineManager } from '../../Core/Framework/Network/OnlineManager';
import { IOnlineGameContextManager } from '../../Network/Manager/IOnlineGameContextManager';
export interface IOnlineService extends IGarbage {
	Register(playerName: string, roomName: string, password: string | undefined, isAdmin: boolean): void;
	GetLobbyManager(): ILobbyManager;
	GetOnlinePlayerManager(): IOnlinePlayerManager;
	IsOnline(): boolean;
	GetOnlineGameContextManager(): IOnlineGameContextManager;
	Publish(runtime: OnlineManager): void;
}
