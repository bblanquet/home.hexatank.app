import { IGarbage } from './../IGarbage';
import { HostState } from './../../Network/HostState';
export interface IHostingService extends IGarbage {
	Register(playerName: string, roomName: string, isAdmin: boolean): void;
	Publish(): HostState;
}
