import { ServerPingObserver } from './ServerPingObserver';
import { RoomSocket } from '../../Server/RoomSocket';
import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';
import { PeerKernel } from '../Kernel/PeerKernel';

export class TimeoutPingObserver {
	public PingReceived: LiteEvent<number> = new LiteEvent<number>();
	private _obs: ServerPingObserver<number>;
	private _isDone: boolean;

	constructor(peerSocket: PeerKernel, socket: RoomSocket, user: string, recipient: string, private Timeout: number) {
		this._isDone = false;
		this._obs = new ServerPingObserver<number>(socket, user, recipient);
		peerSocket.OnShutDown.On(() => {
			this.Stop();
		});
		this._obs.PingReceived.On((e: any, data: number) => {
			if (!this._isDone) {
				let latency = Math.abs(new Date().getTime() - data);
				if (latency < this.Timeout) {
					this._isDone = true;
					this.PingReceived.Invoke(this, latency);
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
		this.PingReceived.Clear();
		this._obs.Stop();
	}
}
