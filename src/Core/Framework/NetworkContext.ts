import { NetworkDispatcher } from './NetworkDispatcher';
import { NetworkReceiver } from './NetworkReceiver';
import { NetworkSocket } from './../../Network/NetworkSocket';
import { GameContext } from './GameContext';
export class NetworkContext {
	private _receiver: NetworkReceiver;
	private _dispatcher: NetworkDispatcher;

	constructor(private _gameContext: GameContext, private _socket: NetworkSocket) {
		this._receiver = new NetworkReceiver(this._socket, this._gameContext);
		this._dispatcher = new NetworkDispatcher(this._gameContext, this._socket);
	}
}
