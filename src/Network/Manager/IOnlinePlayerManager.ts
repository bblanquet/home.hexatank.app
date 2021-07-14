import { Dictionary } from '../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { OnlinePlayer } from '../OnlinePlayer';

export interface IOnlinePlayerManager {
	Player: OnlinePlayer;
	Players: Dictionary<OnlinePlayer>;
	OnPlayersChanged: LiteEvent<Dictionary<OnlinePlayer>>;
	OnPlayerList: SimpleEvent;
	Clear(): void;
	IsSync(): boolean;
}
