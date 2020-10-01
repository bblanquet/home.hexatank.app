import { injectable } from 'inversify';
import { GameContext } from '../../Core/Framework/GameContext';
import { NetworkContext } from '../../Core/Framework/NetworkContext';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { Player } from '../../Network/Player';
import { INetworkService } from './INetworkService';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';

@injectable()
export class NetworkService implements INetworkService {
	//use for network
	public NetworkContext: NetworkContext;
	public Socket: NetworkSocket;
	public Players: Player[] = [];

	Register(networkSocket: NetworkSocket, game: GameContext, players: Player[]): void {
		this.Socket = networkSocket;
		this.Players = players;
		this.NetworkContext = new NetworkContext(game, this.Socket);
	}

	HasSocket(): boolean {
		return !isNullOrUndefined(this.Socket);
	}

	GetPlayers(): Player[] {
		return this.Players;
	}

	Collect(): void {
		this.NetworkContext.Destroy();
		this.Socket.Stop();
		this.Socket = null;
		this.NetworkContext = null;
	}
}
