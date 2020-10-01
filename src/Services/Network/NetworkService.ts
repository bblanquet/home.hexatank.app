import { GameContext } from '../../Core/Framework/GameContext';
import { NetworkContext } from '../../Core/Framework/NetworkContext';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { Player } from '../../Network/Player';
import { INetworkService } from './INetworkService';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';

export class NetworkService implements INetworkService {
	//use for network
	private _networkContext: NetworkContext;
	private _socket: NetworkSocket;
	private _players: Player[] = [];

	Register(networkSocket: NetworkSocket, game: GameContext, players: Player[]): void {
		this._socket = networkSocket;
		this._players = players;
		this._networkContext = new NetworkContext(game, this._socket);
	}

	HasSocket(): boolean {
		return !isNullOrUndefined(this._socket);
	}

	GetPlayers(): Player[] {
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
	}
}
