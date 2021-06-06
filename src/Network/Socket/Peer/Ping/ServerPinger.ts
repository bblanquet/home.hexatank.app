import { PeerContext } from './../PeerContext';
import { BasicServerPinger } from './BasicServerPinger';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';

export class ServerPinger {
	public OnPingReceived: LiteEvent<number> = new LiteEvent<number>();
	private _serverPinger: BasicServerPinger<number>;
	private _isDone: boolean;

	constructor(private _context: PeerContext, private _retryDuration: number) {
		this._isDone = false;
		this._serverPinger = new BasicServerPinger<number>(this._context);
		this._serverPinger.OnReceived.On(this.HandlePing.bind(this));
	}

	public Start(): void {
		this._serverPinger.Start(new Date().getTime());
		this.Retry();
	}

	public Stop(): void {
		this._isDone = true;
		this.OnPingReceived.Clear();
		this._serverPinger.Stop();
	}

	private Retry(): void {
		setTimeout(() => {
			if (!this._isDone) {
				this._serverPinger.Start(new Date().getTime());
				this.Retry();
			}
		}, this._retryDuration);
	}

	private HandlePing(e: any, data: number): void {
		if (!this._isDone) {
			let latency = Math.abs(new Date().getTime() - data);
			if (latency < this._retryDuration) {
				this._isDone = true;
				this.OnPingReceived.Invoke(this, latency);
				this.Stop();
			}
		}
	}
}
