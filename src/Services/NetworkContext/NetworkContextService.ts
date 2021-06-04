import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { GameContext } from '../../Core/Setup/Context/GameContext';
import { NetworkContext } from '../../Core/Framework/NetworkContext';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { INetworkContextService } from './INetworkContextService';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';

export class NetworkContextService implements INetworkContextService {
	//use for network
	private _networkContext: NetworkContext;
	private _socket: NetworkSocket;
	private _players: OnlinePlayer[];

	Register(networkSocket: NetworkSocket, game: GameContext, players: OnlinePlayer[]): void {
		this._players = players;
		this._socket = networkSocket;
		this._networkContext = new NetworkContext(this._socket, game, players);
	}

	HasSocket(): boolean {
		return !isNullOrUndefined(this._socket);
	}

	GetOnlinePlayers(): OnlinePlayer[] {
		return this._players;
	}

	Collect(): void {
		if (this._networkContext) {
			this._networkContext.Destroy();
			this._networkContext = null;
		}
		if (this._socket) {
			this._socket.Stop();
			this._socket = null;
		}

		if (this._players) {
			this._players.forEach((p) => {
				p.OnChanged.Clear();
			});
		}
	}
}
