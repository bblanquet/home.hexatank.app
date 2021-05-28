import { GameContext } from '../../Core/Setup/Context/GameContext';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { IGarbage } from '../IGarbage';
import { OnlinePlayer } from '../../Network/OnlinePlayer';

export interface INetworkService extends IGarbage {
	Register(networkSocket: NetworkSocket, gameContext: GameContext, players: OnlinePlayer[]): void;
	HasSocket(): boolean;
	GetOnlinePlayers(): OnlinePlayer[];
}
