import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import { BlueprintSetup } from '../../Components/Form/BlueprintSetup';
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
