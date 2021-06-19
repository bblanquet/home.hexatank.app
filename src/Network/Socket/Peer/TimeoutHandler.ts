import { PeerContext } from './PeerContext';
import { ServerPinger } from './Ping/ServerPinger';
import { RtcPeer } from './Rtc/RtcPeer';
import { PacketKind } from '../../Message/PacketKind';

export class TimeoutPeerHandler {
	private _servPinger: ServerPinger;
	private _timeOut: NodeJS.Timeout;

	constructor(private _peer: RtcPeer, private _context: PeerContext) {
		this._servPinger = new ServerPinger(this._context, 2000);
		this._servPinger.OnPingReceived.On(this.HandlePingReceived.bind(this));
		this._peer.OnIceStateChanged.On(this.HandleIceStateChanged.bind(this));
		this._timeOut = setTimeout(() => this.TimeOut(), 6000);
		this._peer.OnShutDown.On(() => this._servPinger.Stop());
	}

	protected TimeOut(): void {
		if (!this._peer.IsConnected() && !this._peer.IsShutdown()) {
			console.log(`Timeout ${this._context.Owner} <> ${this._context.Recipient}`);
			this._servPinger.Start();
		}
	}

	private HandleIceStateChanged(): void {
		clearTimeout(this._timeOut);
		if (!this._peer.IsConnected()) {
			this._timeOut = setTimeout(() => this.TimeOut(), 6000);
		}
	}

	private HandlePingReceived(obj: any, data: number): void {
		if (!this._peer.IsConnected()) {
			console.log(`RESET ${this._context.Owner} <> ${this._context.Recipient}`);
			const message = this._context.GetTemplate<any>(PacketKind.Reset);
			this._context.ServerSocket.Emit(message);
			this._peer.ShutDown();
		}
	}
}