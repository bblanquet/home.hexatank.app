import { RoomSocket } from '../../Server/RoomSocket';
import { PacketKind } from '../../Message/PacketKind';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';
import { KindEventObserver } from '../../../Core/Utils/Events/KindEventObserver';

export class ServerPingObserver<T> {
	public PingReceived: LiteEvent<T> = new LiteEvent<T>();
	private _oneWayObserver: KindEventObserver<PacketKind, NetworkMessage<any>>;
	private _twoWayObserver: KindEventObserver<PacketKind, NetworkMessage<any>>;

	constructor(private _socket: RoomSocket, private _user: string, private _recipient: string) {
		this._oneWayObserver = new KindEventObserver<PacketKind, NetworkMessage<any>>(
			PacketKind.OneWayPing,
			this.OnOneWayPingReceived.bind(this)
		);
		this._socket.OnReceived.On(this._oneWayObserver);

		this._twoWayObserver = new KindEventObserver<PacketKind, NetworkMessage<any>>(
			PacketKind.TwoWayPing,
			this.OnTwoWayPingReceived.bind(this)
		);
		this._socket.OnReceived.On(this._twoWayObserver);
	}

	public Start(value: T): void {
		this.SendOneWayPing(value);
	}

	public Stop(): void {
		this.PingReceived.Clear();
		this._socket.OnReceived.Off(this._oneWayObserver);
		this._socket.OnReceived.Off(this._twoWayObserver);
	}

	private OnTwoWayPingReceived(packet: NetworkMessage<T>): void {
		this.PingReceived.Invoke(this, packet.Content);
	}

	private OnOneWayPingReceived(packet: NetworkMessage<T>): void {
		if (packet.Recipient === this._user) {
			const message = new NetworkMessage<T>();
			message.Content = packet.Content;
			message.Recipient = packet.Emitter;
			message.Emitter = packet.Recipient;
			message.Kind = PacketKind.TwoWayPing;
			this._socket.Emit(message);
		}
	}

	private SendOneWayPing(value: T): void {
		const message = new NetworkMessage<T>();
		message.Content = value;
		message.Recipient = this._recipient;
		message.Emitter = this._user;
		message.Kind = PacketKind.OneWayPing;
		this._socket.Emit(message);
	}
}
