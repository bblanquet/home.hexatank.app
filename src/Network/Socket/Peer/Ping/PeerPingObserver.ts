import { PingContent } from './PingContent';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { JetlagData } from './JetlagData';
import { PacketKind } from '../../../Message/PacketKind';
import { NetworkMessage } from '../../../Message/NetworkMessage';
import { RtcPeer } from '../Rtc/RtcPeer';

export class PeerPingObserver {
	public OnPingReceived: LiteEvent<JetlagData> = new LiteEvent<JetlagData>();
	public OnTimeoutStateChanged: LiteEvent<boolean> = new LiteEvent<boolean>();
	private _jetlag: JetlagData = new JetlagData();
	private _timeOut: NodeJS.Timeout;
	private _shortSleep: number = 500;
	private _timeoutSleep: number = 1500;
	private _pingInterval: number = 2000;

	constructor(private _peer: RtcPeer, private _owner: string, private _recipient: string) {
		this._peer.OnReceived.On(this.OnOneWayPingReceived.bind(this));
		this._peer.OnReceived.On(this.OnTwoWayPingReceived.bind(this));
		this._peer.OnShutDown.On(() => this.Stop());
	}

	public Start(): void {
		setTimeout(() => {
			const message = new NetworkMessage<PingContent>();
			message.Content = new PingContent();
			message.Content.EmittedDate = new Date().getTime();
			message.Recipient = this._recipient;
			message.Emitter = this._owner;
			message.Kind = PacketKind.OneWayPing;
			this._peer.Send(message);

			this._timeOut = setTimeout(() => {
				this.OnTimeoutStateChanged.Invoke(this, true);
			}, this._timeoutSleep);
		}, this._shortSleep);
	}

	public Stop(): void {
		this.OnPingReceived.Clear();
	}

	public GetJetlag(): JetlagData {
		return this._jetlag;
	}

	private OnTwoWayPingReceived(peer: any, packet: NetworkMessage<PingContent>): void {
		if (packet.Recipient === this._owner && packet.Kind === PacketKind.TwoWayPing) {
			const data = new JetlagData();
			data.CalculationDate = new Date().getTime();
			data.Latency = Math.abs(data.CalculationDate - packet.Content.EmittedDate) / 2;
			const emittedDateFromRecipientClock = packet.Content.ReceivedDate - data.Latency;
			const emittedDate = packet.Content.EmittedDate;
			data.Jetlag = Math.abs(emittedDate - emittedDateFromRecipientClock);
			data.JetlagSign = emittedDate < emittedDateFromRecipientClock;
			this._jetlag = data;
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
			message.Recipient = this._recipient;
			message.Content = new PingContent();
			message.Content.EmittedDate = packet.Content.EmittedDate;
			message.Content.ReceivedDate = new Date().getTime();
			message.Kind = PacketKind.TwoWayPing;
			this._peer.Send(message);
		}
	}
}
