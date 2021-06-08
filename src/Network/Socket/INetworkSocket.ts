import { NetworkMessage } from './../Message/NetworkMessage';
import { KindEvent } from '../../Core/Utils/Events/KindEvent';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { PacketKind } from '../Message/PacketKind';
import { PeerSocket } from './Peer/PeerSocket';

export interface ISocketWrapper {
	OnConnectedChanged: LiteEvent<boolean>;
	OnPeerConnectionChanged: LiteEvent<PeerSocket>;
	OnReceived: KindEvent<PacketKind, NetworkMessage<any>>;
	EmitAll<T>(kind: PacketKind, content: T): void;
	Emit(message: NetworkMessage<any>): void;
	Stop(): void;
}
