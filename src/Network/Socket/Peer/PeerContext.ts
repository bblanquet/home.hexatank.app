import { ErrorHandler, ErrorCat } from '../../../Utils/Exceptions/ErrorHandler';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PacketKind } from '../../Message/PacketKind';
import { IServerSocket } from '../Server/IServerSocket';

export class PeerContext {
	constructor(
		public ServerSocket: IServerSocket,
		public RoomName: string,
		public Owner: string,
		public Recipient: string
	) {
		if (this.Owner === this.Recipient) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
		}
	}

	public GetTemplate<T>(kind: PacketKind): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Kind = kind;
		message.Emitter = this.Owner;
		message.Recipient = this.Recipient;
		message.RoomName = this.RoomName;
		return message;
	}
}
