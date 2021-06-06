import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';

export interface ISocketService {
	Publish(): IServerSocket;
	Collect(): void;
}
