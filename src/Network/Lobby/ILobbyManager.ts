import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { SimpleEvent } from '../../Core/Utils/Events/SimpleEvent';
import { OnlinePlayer } from '../OnlinePlayer';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Message } from '../../Components/Network/Message';
export interface ILobbyManager {
	Player: OnlinePlayer;
	Players: Dictionnary<OnlinePlayer>;

	OnMessageReceived: LiteEvent<Message>;
	OnPlayersChanged: LiteEvent<Dictionnary<OnlinePlayer>>;
	OnKicked: SimpleEvent;

	SendMessage(content: string): void;
	Kick(playerName: string): void;
	SetReady(): void;
	Close(): void;
	Leave(): void;
}
