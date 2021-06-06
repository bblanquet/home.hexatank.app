import { NetworkMessage } from './../../Message/NetworkMessage';
import { PacketKind } from './../../Message/PacketKind';
import { Dictionnary } from '../../../Core/Utils/Collections/Dictionnary';
import { IServerSocket } from './IServerSocket';
import * as io from 'socket.io-client';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { NetworkObserver } from '../../NetworkObserver';

export class ServerSocket implements IServerSocket {
	private _socket: SocketIOClient.Socket;
	private _obs: Dictionnary<NetworkObserver[]>;

	constructor() {
		this._obs = new Dictionnary<NetworkObserver[]>();
		this._socket = io('{{p2pserver}}', { path: '{{p2psubfolder}}' });
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
				this._obs.Get(key).push(observer);
			} else {
				this._obs.Add(key, [ observer ]);
				this._socket.on(key, (payload: NetworkMessage<any>) => {
					console.log(`[RECEIVED] [${key}] [${payload ? payload.Emitter : 'undefined'}]`);
					this._obs.Get(key).forEach((obs) => {
						obs.Handler(payload);
					});
				});
			}
			console.log(`[ADDED OBS] ${key}`);
		});
	}

	Off(obsList: NetworkObserver[] = []): void {
		if (this.IsClear(obsList)) {
			console.log(`[REMOVED ALL OBS]`);
			this._obs.Keys().forEach((obsKey) => {
				this._socket.off(obsKey);
				this._obs.Remove(obsKey);
			});
		} else {
			obsList.forEach((obs) => {
				const kindObs = this._obs.Get(PacketKind[obs.Value]);
				if (kindObs) {
					const newKindObs = kindObs.filter((o) => o !== obs);
					this._obs.Add(PacketKind[obs.Value], newKindObs);
					if (newKindObs.length === 0) {
						this._socket.off(PacketKind[obs.Value]);
						this._obs.Remove(PacketKind[obs.Value]);
					}
					console.log(`[REMOVED OBS] ${PacketKind[obs.Value]}`);
				} else {
					console.log(`[TRY TO REMOVE UNEXISTING OBS] ${PacketKind[obs.Value]}`);
				}
			});
		}
	}

	private IsClear(obs: NetworkObserver[]) {
		return obs && obs.length === 0;
	}

	Emit(packet: INetworkMessage): void {
		console.log(`[SENT] [${PacketKind[packet.Kind]}] [${packet.RoomName}] [${packet.Recipient}]`);
		this._socket.emit(PacketKind[packet.Kind], packet);
	}
	Close(): void {
		if (this._socket) {
			this._socket.close();
		}
	}
}
