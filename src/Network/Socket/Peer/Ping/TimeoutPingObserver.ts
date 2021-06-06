import { ServerPingObserver } from './ServerPingObserver';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';
import { RtcPeer } from '../Rtc/RtcPeer';
import { IServerSocket } from '../../Server/IServerSocket';

export class TimeoutPingObserver {
	public OnPingReceived: LiteEvent<number> = new LiteEvent<number>();
	private _obs: ServerPingObserver<number>;
	private _isDone: boolean;

	constructor(
		peerSocket: RtcPeer,
		socket: IServerSocket,
		roomName: string,
		owner: string,
		recipient: string,
		private Timeout: number
	) {
		this._isDone = false;
		this._obs = new ServerPingObserver<number>(socket, roomName, owner, recipient);
		peerSocket.OnShutDown.On(() => {
			this.Stop();
		});
		this._obs.PingReceived.On((e: any, data: number) => {
			if (!this._isDone) {
				let latency = Math.abs(new Date().getTime() - data);
				if (latency < this.Timeout) {
					this._isDone = true;
					this.OnPingReceived.Invoke(this, latency);
					this.Stop();
				}
			}
		});
	}

	public Start(): void {
		this._obs.Start(new Date().getTime());
		this.Retry();
	}

	private Retry(): void {
		setTimeout(() => {
			if (!this._isDone) {
				this._obs.Start(new Date().getTime());
				this.Retry();
			}
		}, this.Timeout);
	}

	public Stop(): void {
		this._isDone = true;
		this.OnPingReceived.Clear();
		this._obs.Stop();
	}
}
