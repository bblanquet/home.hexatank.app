import { GameContext } from './../../Core/Framework/GameContext';
import { NetworkSocket } from '../../Network/NetworkSocket';
import { IGarbage } from '../IGarbage';

export interface INetworkService extends IGarbage {
	Register(networkSocket: NetworkSocket, game: GameContext): void;
	HasSocket(): boolean;
}
