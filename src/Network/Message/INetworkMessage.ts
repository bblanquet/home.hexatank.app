import { PacketKind } from './PacketKind';
import { ProtocolKind } from './ProtocolKind';

export interface INetworkMessage {
	Emitter: string;
	Recipient: string;
	RoomName: string;
	Kind: PacketKind;
	EmittedDate: number;
	SeqNum: number;
	IsAck: boolean;
	Protocol: ProtocolKind;
	HasContent(): boolean;
	GetContent(): any;
}
