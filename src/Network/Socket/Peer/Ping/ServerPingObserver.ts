import { NetworkObserver } from './../../../NetworkObserver';
import { PacketKind } from '../../../Message/PacketKind';
import { NetworkMessage } from '../../../Message/NetworkMessage';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';
import { IServerSocket } from '../../Server/IServerSocket';

export class ServerPingObserver<T> {
	public PingReceived: LiteEvent<T> = new LiteEvent<T>();
	private _obs: NetworkObserver[];

	constructor(
		private _socket: IServerSocket,
		private _roomName: string,
		private _owner: string,
		private _recipient: string
	) {
		this._obs = [
			new NetworkObserver(PacketKind.OneWayPing, this.OnOneWayPingReceived.bind(this)),
			new NetworkObserver(PacketKind.TwoWayPing, this.OnTwoWayPingReceived.bind(this))
		];
		this._socket.On(this._obs);
	}

	public Start(value: T): void {
		this.SendOneWayPing(value);
	}

	public Stop(): void {
		this.PingReceived.Clear();
		this._socket.Off(this._obs);
	}

	private OnTwoWayPingReceived(packet: NetworkMessage<T>): void {
		this.PingReceived.Invoke(this, packet.Content);
	}

	private OnOneWayPingReceived(packet: NetworkMessage<T>): void {
		if (packet.Recipient === this._owner) {
			const message = new NetworkMessage<T>();
			message.Content = packet.Content;
			message.Recipient = packet.Emitter;
			message.Emitter = packet.Recipient;
			message.RoomName = this._roomName;
			message.Kind = PacketKind.TwoWayPing;
			this._socket.Emit(message);
		}
	}

	private SendOneWayPing(value: T): void {
		const message = new NetworkMessage<T>();
		message.Content = value;
		message.Recipient = this._recipient;
		message.Emitter = this._owner;
		message.RoomName = this._roomName;
		message.Kind = PacketKind.OneWayPing;
		this._socket.Emit(message);
	}
}
