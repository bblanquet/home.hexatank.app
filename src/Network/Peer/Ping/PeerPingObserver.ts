import { PingContent } from './PingContent';
import { LiteEvent } from './../../../Core/Utils/Events/LiteEvent';
import { PingData } from './PingData';
import { PacketKind } from '../../Message/PacketKind';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PeerSocket } from '../PeerSocket';

export class PeerPingObserver {
	public OnPingReceived: LiteEvent<PingData> = new LiteEvent<PingData>();
	public OnTimeoutStateChanged: LiteEvent<boolean> = new LiteEvent<boolean>();
	private _pingData: PingData = new PingData();
	private _timeOut: NodeJS.Timeout;
	private _shortSleep: number = 500;
	private _timeoutSleep: number = 1000;
	private _pingInterval: number = 2000;

	constructor(private _socket: PeerSocket, private _owner: string) {
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

			this._timeOut = setTimeout(() => {
				this.OnTimeoutStateChanged.Invoke(this, true);
			}, this._timeoutSleep);
		}, this._shortSleep);
	}

	public Stop(): void {
		this.OnPingReceived.Clear();
	}

	public GetLastPingData(): PingData {
		return this._pingData;
	}

	private OnTwoWayPingReceived(peer: any, packet: NetworkMessage<PingContent>): void {
		if (packet.Recipient === this._owner && packet.Kind === PacketKind.TwoWayPing) {
			const data = new PingData();
			data.PingDate = new Date().getTime();
			data.Latency = Math.abs(data.PingDate - packet.Content.EmittedDate) / 2;
			const recipientRefEmittedDate = packet.Content.ReceivedDate - data.Latency;
			data.DateDelta = Math.abs(packet.Content.EmittedDate - recipientRefEmittedDate);
			data.DeltaSign = packet.Content.EmittedDate < recipientRefEmittedDate;
			this._pingData = data;
			clearTimeout(this._timeOut);
			this.OnTimeoutStateChanged.Invoke(this, false);
			this.OnPingReceived.Invoke(this, data);
			setTimeout(() => {
				this.Start();
			}, this._pingInterval);
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
