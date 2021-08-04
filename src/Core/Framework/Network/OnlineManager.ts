import { OnlineSender } from './OnlineSender';
import { OnlineSync } from './OnlineSync';
import { OnlineReceiver } from './OnlineReceiver';
import { ISocketWrapper } from '../../../Network/Socket/INetworkSocket';
import { Gameworld } from '../World/Gameworld';
import { IOnlinePlayerManager } from '../../../Network/Manager/IOnlinePlayerManager';

export class OnlineManager {
	private _receiver: OnlineReceiver;
	private _dispatcher: OnlineSender;
	private _sync: OnlineSync;
	constructor(
		private _socket: ISocketWrapper,
		private _gameContext: Gameworld,
		private _players: IOnlinePlayerManager
	) {
		this._receiver = new OnlineReceiver(this._socket, this._gameContext);
		this._dispatcher = new OnlineSender(this._socket, this._gameContext);
		this._sync = new OnlineSync(this._socket, this._gameContext, this._players);
	}

	public Clear(): void {
		this._receiver.Clear();
		this._dispatcher.Clear();
		this._sync.Clear();
	}
}
