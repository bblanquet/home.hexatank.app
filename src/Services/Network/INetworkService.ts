import { GameContext } from './../../Core/Framework/GameContext';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { Player } from '../../Network/Player';
import { IGarbage } from '../IGarbage';

export interface INetworkService extends IGarbage {
	Register(networkSocket: NetworkSocket, game: GameContext, players: Player[]): void;
	GetPlayers(): Player[];
	HasSocket(): boolean;
}
