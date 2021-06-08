import { IOnlinePlayerManager } from '../../Network/Manager/IOnlinePlayerManager';
import { ILobbyManager } from '../../Network/Manager/ILobbyManager';
import { IGarbage } from '../IGarbage';
import { OnlineRuntimeManager } from '../../Core/Framework/OnlineRuntimeManager';
import { IOnlineGameContextManager } from '../../Network/Manager/IOnlineGameContextManager';
export interface IOnlineService extends IGarbage {
	Register(playerName: string, roomName: string, password: string, hasPassword: boolean, isAdmin: boolean): void;
	GetLobbyManager(): ILobbyManager;
	GetOnlinePlayerManager(): IOnlinePlayerManager;
	GetOnlineGameContextManager(): IOnlineGameContextManager;
	Publish(runtime: OnlineRuntimeManager): void;
}
