import { OnlineRuntimeDispatcher } from './OnlineRuntimeDispatcher';
import { OnlineRuntimeReceiver } from './OnlineRuntimeReceiver';
import { ISocketWrapper } from '../../../Network/Socket/INetworkSocket';
import { GameContext } from '../../Setup/Context/GameContext';

export class OnlineRuntimeManager {
	private _receiver: OnlineRuntimeReceiver;
	private _dispatcher: OnlineRuntimeDispatcher;

	constructor(private _socket: ISocketWrapper, private _gameContext: GameContext) {
		this._receiver = new OnlineRuntimeReceiver(this._socket, this._gameContext);
		this._dispatcher = new OnlineRuntimeDispatcher(this._socket, this._gameContext);
	}

	public Clear(): void {
		this._receiver.Clear();
		this._dispatcher.Clear();
	}
}
