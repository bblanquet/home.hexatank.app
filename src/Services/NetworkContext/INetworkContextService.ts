import { GameContext } from '../../Core/Setup/Context/GameContext';
import { SocketWrapper } from '../../Network/Socket/SocketWrapper';
import { IGarbage } from '../IGarbage';
import { OnlinePlayer } from '../../Network/OnlinePlayer';

export interface INetworkContextService extends IGarbage {
	Register(networkSocket: SocketWrapper, gameContext: GameContext, players: OnlinePlayer[]): void;
	HasSocket(): boolean;
	GetOnlinePlayers(): OnlinePlayer[];
}
