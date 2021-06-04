import { PacketKind } from './Message/PacketKind';
import { NetworkObserver } from './NetworkObserver';
import { INetworkMessage } from './Message/INetworkMessage';

export interface IServerSocket {
	On(obs: NetworkObserver[]): void;
	Off(obs: PacketKind[]): void;
	Emit(packet: INetworkMessage): void;
	Close(): void;
	Connect(): void;
	Debug(): SocketIOClient.Socket;
}
