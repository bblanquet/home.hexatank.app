import { Dictionary } from '../../Core/Utils/Collections/Dictionary';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { OnlinePlayer } from '../OnlinePlayer';

export interface IOnlinePlayerManager {
	Player: OnlinePlayer;
	Players: Dictionary<OnlinePlayer>;
	OnPlayersChanged: LiteEvent<Dictionary<OnlinePlayer>>;
	Clear(): void;
	IsSync(): boolean;
}
