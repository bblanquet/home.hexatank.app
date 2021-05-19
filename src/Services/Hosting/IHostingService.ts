import { HostState } from '../../Components/Network/HostState';
import { IGarbage } from './../IGarbage';
export interface IHostingService extends IGarbage {
	Register(playerName: string, roomName: string, password: string, hasPassword: boolean, isAdmin: boolean): void;
	Publish(): HostState;
}
