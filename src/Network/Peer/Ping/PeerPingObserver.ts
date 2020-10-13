import { PingContent } from './PingContent';
import { LiteEvent } from './../../../Core/Utils/Events/LiteEvent';
import { SimpleEvent } from './../../../Core/Utils/Events/SimpleEvent';
import { PingData } from './PingData';
import { PacketKind } from '../../Message/PacketKind';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PeerSocket } from '../PeerSocket';

export class PeerPingObserver {
	public OnPingReceived: LiteEvent<PingData> = new LiteEvent<PingData>();
	public OnTimeOutReceived: SimpleEvent;
	private _pingData: PingData = new PingData();

	constructor(private _socket: PeerSocket, private _owner: string) {
		this.OnTimeOutReceived = new SimpleEvent();
		this._socket.OnReceivedMessage.On(this.OnOneWayPingReceived.bind(this));
		this._socket.OnReceivedMessage.On(this.OnTwoWayPingReceived.bind(this));
	}

	public Start(): void {
		setTimeout(() => {
			const message = new NetworkMessage<PingContent>();
			message.Content = new PingContent();
			message.Content.EmittedDate = new Date().getTime();
			message.Recipient = this._socket.GetRecipient();
			message.Emitter = this._owner;
			message.Kind = PacketKind.OneWayPing;
			this._socket.Send(message);
		}, 500);
	}

	public Stop(): void {
		this.OnPingReceived.Clear();
	}

	public GetLastPingData(): PingData {
		return this._pingData;
	}

	private OnTwoWayPingReceived(peer: any, packet: NetworkMessage<PingContent>): void {
		if (packet.Recipient === this._owner && packet.Kind === PacketKind.TwoWayPing) {
			const now = new Date().getTime();
			const latency = Math.abs(now - packet.Content.EmittedDate) / 2;
			const receiverEmittedDate = packet.Content.ReceivedDate - latency;
			const data = new PingData();
			data.Latency = latency;
			data.PingDate = now;
			data.Delta = Math.abs(packet.Content.EmittedDate - receiverEmittedDate);
			this._pingData = data;

			this.OnPingReceived.Invoke(this, data);
			setTimeout(() => {
				this.Start();
			}, 2000);
		}
	}

	private OnOneWayPingReceived(peer: any, packet: NetworkMessage<PingContent>): void {
		if (packet.Recipient === this._owner && packet.Kind === PacketKind.OneWayPing) {
			const message = new NetworkMessage<PingContent>();
			message.Emitter = this._owner;
			message.Recipient = this._socket.GetRecipient();
			message.Content = new PingContent();
			message.Content.EmittedDate = packet.Content.EmittedDate;
			message.Content.ReceivedDate = new Date().getTime();
			message.Kind = PacketKind.TwoWayPing;
			this._socket.Send(message);
		}
	}
}
