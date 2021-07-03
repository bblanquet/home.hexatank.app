import { Dictionary } from '../../Utils/Collections/Dictionary';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { BlueprintSetup } from '../Components/Form/BlueprintSetup';
import { Message } from './Message';
import { LobbyMode } from './LobbyMode';

export class LobbyState {
	public Players: Dictionary<OnlinePlayer>;
	public Player: OnlinePlayer;

	public Mode: LobbyMode = LobbyMode.pending;

	//???
	public Message: string = '';
	public Messages: Message[] = [];

	//???
	public MapSetting: BlueprintSetup = new BlueprintSetup();
}
