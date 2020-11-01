import { PacketKind } from '../Message/PacketKind';
import { SimpleEvent } from './../../Core/Utils/Events/SimpleEvent';
import { INetworkMessage } from './../Message/INetworkMessage';
import { PeerKernel } from './Kernel/PeerKernel';

export class TcpSender {
	private _timeOut: NodeJS.Timeout;
	private _timeoutSleep: number = 1000;
	private _retry: number = 4;
	private _try: number = 0;
	private _OnAckReceived: any;
	private _isDone: boolean = false;
	public OnDone: SimpleEvent;

	constructor(private _socket: PeerKernel, private _message: INetworkMessage) {
		this._OnAckReceived = this.OnAckReceived.bind(this);
		this._socket.OnReceivedMessage.On(this._OnAckReceived);
		this._socket.OnShutDown.On(this.Stop.bind(this));
		this.OnDone = new SimpleEvent();
		this.Send();
	}

	private Send(): void {
		if (this._retry <= this._try) {
			this.Stop();
		}

		this._try += 1;
		this._socket.Send(this._message);
		this._timeOut = setTimeout(() => {
			this.Send();
		}, this._timeoutSleep);
	}

	public Stop() {
		this._isDone = true;
		this._socket.OnShutDown.Off(this._OnAckReceived);
		clearTimeout(this._timeOut);
		this.OnDone.Invoke();
		this.OnDone.Clear();
	}

	public IsDone() {
		return this._isDone;
	}

	public GetKind(): PacketKind {
		return this._message.Kind;
	}

	private OnAckReceived(peer: any, packet: INetworkMessage): void {
		if (
			packet.Recipient === this._message.Emitter &&
			packet.Kind === this._message.Kind &&
			packet.SeqNum === this._message.SeqNum &&
			packet.IsAck
		) {
			this.Stop();
		}
	}
}
