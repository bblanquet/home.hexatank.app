import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { OnlinePlayer } from '../OnlinePlayer';

export interface IOnlinePlayerManager {
	Player: OnlinePlayer;
	Players: Dictionnary<OnlinePlayer>;
	OnPlayersChanged: LiteEvent<Dictionnary<OnlinePlayer>>;
	Clear(): void;
}
