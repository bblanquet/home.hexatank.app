import { BlueprintSetup } from '../Form/BlueprintSetup';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Message } from './Message';

export class LobbyState {
	public Players: Dictionnary<OnlinePlayer>;
	public Player: OnlinePlayer;

	//???
	public Message: string = '';
	public Messages: Message[] = [];

	//???
	public MapSetting: BlueprintSetup = new BlueprintSetup();
}
