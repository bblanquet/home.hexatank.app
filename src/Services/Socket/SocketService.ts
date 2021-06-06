import { ServerSocket } from './../../Network/Socket/Server/ServerSocket';
import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';
import { ISocketService } from './ISocketService';

export class SocketService implements ISocketService {
	private _socket: IServerSocket;
	Publish(): IServerSocket {
		if (!this._socket) {
			this._socket = new ServerSocket();
		}
		this._socket.Connect();
		return this._socket;
	}
	Collect(): void {
		this._socket.Close();
		this._socket = null;
	}
}
