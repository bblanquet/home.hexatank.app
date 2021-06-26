import { BlueprintSetup } from '../Form/BlueprintSetup';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { Dictionary } from '../../Core/Utils/Collections/Dictionary';
import { Message } from './Message';

export class LobbyState {
	public Players: Dictionary<OnlinePlayer>;
	public Player: OnlinePlayer;

	//???
	public Message: string = '';
	public Messages: Message[] = [];

	//???
	public MapSetting: BlueprintSetup = new BlueprintSetup();
}
