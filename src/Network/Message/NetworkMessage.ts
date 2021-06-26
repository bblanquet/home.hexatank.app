import { ProtocolKind } from './ProtocolKind';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';
import { INetworkMessage } from './INetworkMessage';
import { PacketKind } from './PacketKind';

export class NetworkMessage<T> implements INetworkMessage {
	public Content: T;
	public RoomName: string;

	public Emitter: string;
	public Recipient: string;

	public SeqNum: number;
	public Protocol: ProtocolKind;
	public IsAck: boolean;

	public Kind: PacketKind;
	public EmittedDate: number;
	public Latency: number | null = null;

	public HasContent(): boolean {
		return !isNullOrUndefined(this.Content);
	}

	GetContent(): any {
		return this.Content;
	}

	public static New<T>(kind: PacketKind, content: T): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Kind = kind;
		message.Content = content;
		return message;
	}
}
