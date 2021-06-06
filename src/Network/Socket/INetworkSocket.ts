import { KindEvent } from '../../Core/Utils/Events/KindEvent';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { INetworkMessage } from '../Message/INetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { PeerSocket } from './Peer/PeerSocket';

export interface ISocketWrapper {
	OnConnectedChanged: LiteEvent<boolean>;
	OnPeerConnectionChanged: LiteEvent<PeerSocket>;
	OnReceived: KindEvent<PacketKind, INetworkMessage>;
	EmitAll<T>(kind: PacketKind, content: T): void;
	Emit(message: INetworkMessage): void;
	Stop(): void;
}
