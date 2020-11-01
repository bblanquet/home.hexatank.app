import { INetworkMessage } from './INetworkMessage';
import { PacketKind } from './PacketKind';
import { ProtocolKind } from './ProtocolKind';

export class EmptyMessage implements INetworkMessage {
	SeqNum: number;
	IsAck: boolean;
	Protocol: ProtocolKind;
	EmittedDate: number;
	RoomName: string;
	Emitter: string;
	Recipient: string;
	Kind: PacketKind;

	HasContent(): boolean {
		return false;
	}

	GetContent(): any {
		return null;
	}
}
