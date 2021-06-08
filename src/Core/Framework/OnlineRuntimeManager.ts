import { ISocketWrapper } from '../../Network/Socket/INetworkSocket';
import { OnlineRuntimeDispatcher } from './OnlineRuntimeDispatcher';
import { OnlineRuntimeReceiver } from './OnlineRuntimeReceiver';
import { GameContext } from '../Setup/Context/GameContext';
export class OnlineRuntimeManager {
	private _receiver: OnlineRuntimeReceiver;
	private _dispatcher: OnlineRuntimeDispatcher;

	constructor(private _socket: ISocketWrapper, private _gameContext: GameContext) {
		this._receiver = new OnlineRuntimeReceiver(this._socket, this._gameContext);
		this._dispatcher = new OnlineRuntimeDispatcher(this._socket, this._gameContext);
	}

	public Clear(): void {}
}

// this._socket.OnReceived.On(this._pingObserver);
// this._socket.OnReceived.On(this._timeOutObserver);

// private HandlePing(message: NetworkMessage<string>): void {
// 	if (this._players.some((p) => p.Name === message.Emitter)) {
// 		this._players.find((p) => p.Name === message.Emitter).SetLatency(message.Content);
// 	}
// }

// private HandleTimeout(message: NetworkMessage<boolean>): void {
// 	if (this._players.some((p) => p.Name === message.Emitter)) {
// 		this._players.find((p) => p.Name === message.Emitter).SetTimeOut(message.Content);
// 	}
// }
