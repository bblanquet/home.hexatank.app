import { IServerPinger } from './IServerPinger';
import { NetworkObserver } from '../../../../Core/Utils/Events/NetworkObserver';
import { PacketKind } from '../../../Message/PacketKind';
import { NetworkMessage } from '../../../Message/NetworkMessage';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';
import { PeerContext } from '../PeerContext';

export class BasicServerPinger<T> implements IServerPinger<T> {
	public OnReceived: LiteEvent<T> = new LiteEvent<T>();
	private _obs: NetworkObserver[];

	constructor(private _context: PeerContext) {
		this._obs = [
			new NetworkObserver(PacketKind.OneWayPing, this.OnOneWayPingReceived.bind(this)),
			new NetworkObserver(PacketKind.TwoWayPing, this.OnTwoWayPingReceived.bind(this))
		];
		this._context.ServerSocket.On(this._obs);
	}

	public Start(value: T): void {
		this.SendOneWayPing(value);
	}

	public Stop(): void {
		this.OnReceived.Clear();
		this._context.ServerSocket.Off(this._obs);
	}

	private OnTwoWayPingReceived(packet: NetworkMessage<T>): void {
		this.OnReceived.Invoke(this, packet.Content);
	}

	private OnOneWayPingReceived(packet: NetworkMessage<T>): void {
		if (packet.Recipient === this._context.Owner) {
			const message = new NetworkMessage<T>();
			message.Content = packet.Content;
			message.Recipient = packet.Emitter;
			message.Emitter = packet.Recipient;
			message.RoomName = this._context.RoomName;
			message.Kind = PacketKind.TwoWayPing;
			this._context.ServerSocket.Emit(message);
		}
	}

	private SendOneWayPing(value: T): void {
		const message = new NetworkMessage<T>();
		message.Content = value;
		message.Recipient = this._context.Recipient;
		message.Emitter = this._context.Owner;
		message.RoomName = this._context.RoomName;
		message.Kind = PacketKind.OneWayPing;
		this._context.ServerSocket.Emit(message);
	}
}
