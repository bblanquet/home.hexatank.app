import { ILobbyManager } from './../../Network/Lobby/ILobbyManager';
import { IGarbage } from '../IGarbage';
export interface ILobbyService extends IGarbage {
	Register(playerName: string, roomName: string, password: string, hasPassword: boolean, isAdmin: boolean): void;
	Publish(): ILobbyManager;
}
