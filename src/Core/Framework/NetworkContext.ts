import { NetworkMessage } from './../../Network/Message/NetworkMessage';
import { NetworkDispatcher } from './NetworkDispatcher';
import { NetworkReceiver } from './NetworkReceiver';
import { NetworkSocket } from './../../Network/NetworkSocket';
import { GameContext } from './GameContext';
import { PacketKind } from '../../Network/Message/PacketKind';
import { NetworkObserver } from '../../Network/NetworkObserver';
export class NetworkContext {
	private _receiver: NetworkReceiver;
	private _dispatcher: NetworkDispatcher;
	private _pingObserver: NetworkObserver;
	private _timeOutObserver: NetworkObserver;

	constructor(private _gameContext: GameContext, private _socket: NetworkSocket) {
		this._pingObserver = new NetworkObserver(PacketKind.Ping, this.HandlePing.bind(this));
		this._timeOutObserver = new NetworkObserver(PacketKind.TimeOut, this.HandleTimeout.bind(this));
		this._receiver = new NetworkReceiver(this._socket, this._gameContext);
		this._dispatcher = new NetworkDispatcher(this._gameContext, this._socket);
		this._socket.OnReceived.On(this._pingObserver);
		this._socket.OnReceived.On(this._timeOutObserver);
	}

	private HandlePing(message: NetworkMessage<string>): void {
		if (this._gameContext.Players.some((p) => p.Name === message.Emitter)) {
			this._gameContext.Players.find((p) => p.Name === message.Emitter).SetLatency(message.Content);
		}
	}

	private HandleTimeout(message: NetworkMessage<boolean>): void {
		if (this._gameContext.Players.some((p) => p.Name === message.Emitter)) {
			this._gameContext.Players.find((p) => p.Name === message.Emitter).SetTimeOut(message.Content);
		}
	}

	public Destroy(): void {
		this._socket.Stop();
	}
}
