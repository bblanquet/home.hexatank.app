import { Dictionnary } from './../Core/Utils/Collections/Dictionnary';
import { NetworkObserver } from './NetworkObserver';
import { IServerSocket } from './IServerSocket';
import { INetworkMessage } from './Message/INetworkMessage';
import { PacketKind } from './Message/PacketKind';
import * as io from 'socket.io-client';

export class ServerSocket implements IServerSocket {
	private _socket: SocketIOClient.Socket;
	private _obs: Dictionnary<NetworkObserver>;

	constructor() {
		this._obs = new Dictionnary<NetworkObserver>();
		this._socket = io('{{p2pserver}}', { path: '{{p2psubfolder}}' });
	}
	Debug(): SocketIOClient.Socket {
		return this._socket;
	}
	Connect(): void {
		if (!this._socket.connected) {
			this._socket.connect();
		}
	}

	On(obs: NetworkObserver[]): void {
		obs.forEach((observer) => {
			const key = PacketKind[observer.Value];
			if (this._obs.Exist(key)) {
				throw 'network obs already exists';
			}
			this._obs.Add(key, observer);
			this._socket.on(key, observer.Handler);
			console.log(`[ADDED OBS] ${key}`);
		});
	}
	Off(obs: PacketKind[] = []): void {
		if (obs && obs.length === 0) {
			this._obs.Keys().forEach((obsKey) => {
				this._socket.off(obsKey);
				this._obs.Remove(obsKey);
				console.log(`[REMOVED OBS] ${obsKey}`);
			});
		} else {
			obs.forEach((obsKey) => {
				this._socket.off(PacketKind[obsKey]);
				this._obs.Remove(PacketKind[obsKey]);
				console.log(`[REMOVED OBS] ${obsKey}`);
			});
		}
	}

	Emit(packet: INetworkMessage): void {
		this._socket.emit(PacketKind[packet.Kind], packet);
	}
	Close(): void {
		if (this._socket) {
			this._socket.close();
		}
	}
}
