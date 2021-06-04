import { IServerSocket } from './../../Network/IServerSocket';
export interface ISocketService {
	Publish(): IServerSocket;
	Collect(): void;
}
