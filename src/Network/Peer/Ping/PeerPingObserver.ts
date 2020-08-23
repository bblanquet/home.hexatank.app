import { LiteEvent } from './../../../Core/Utils/Events/LiteEvent';
import { SimpleEvent } from './../../../Core/Utils/Events/SimpleEvent';
import { PingPacket } from './PingPacket';
import { PacketKind } from '../../Message/PacketKind';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PeerSocket } from '../PeerSocket';

export class PeerPingObserver {
	public PingReceived: LiteEvent<string> = new LiteEvent<string>();
	public TimeOutReceived: SimpleEvent;
	private _pingPacket: PingPacket = new PingPacket();

	constructor(private _socket: PeerSocket, private _owner: string) {
		this.TimeOutReceived = new SimpleEvent();
		this._socket.OnReceivedMessage.On(this.OnOneWayPingReceived.bind(this));
		this._socket.OnReceivedMessage.On(this.OnTwoWayPingReceived.bind(this));
	}

	public Start(): void {
		setTimeout(() => {
			const message = new NetworkMessage<number>();
			message.Content = new Date().getTime();
			message.Recipient = this._socket.GetRecipient();
			message.Emitter = this._owner;
			message.Kind = PacketKind.OneWayPing;
			this._socket.Send(message);
		}, 500);
	}

	public Stop(): void {
		this.PingReceived.Clear();
	}

	public GetLastPing(): PingPacket {
		return this._pingPacket;
	}

	private OnTwoWayPingReceived(peer: any, packet: NetworkMessage<number>): void {
		if (packet.Recipient === this._owner && packet.Kind === PacketKind.TwoWayPing) {
			const now = new Date().getTime();
			const latency = Math.abs(now - packet.Content);

			const ping = new PingPacket();
			ping.Latency = latency;
			ping.Date = now;
			this._pingPacket = ping;

			this.PingReceived.Invoke(this, latency.toString());
			setTimeout(() => {
				this.Start();
			}, 2000);
		}
	}

	private OnOneWayPingReceived(peer: any, packet: NetworkMessage<number>): void {
		if (packet.Recipient === this._owner && packet.Kind === PacketKind.OneWayPing) {
			const message = new NetworkMessage<number>();
			message.Emitter = this._owner;
			message.Recipient = this._socket.GetRecipient();
			message.Content = packet.Content;
			message.Kind = PacketKind.TwoWayPing;
			this._socket.Send(message);
		}
	}
}
