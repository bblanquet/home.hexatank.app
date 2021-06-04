import { ServerSocket } from './../../Network/ServerSocket';
import { IServerSocket } from './../../Network/IServerSocket';
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
