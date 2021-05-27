import { MapSetting } from './../Form/MapSetting';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Message } from './Message';

export class HostState {
	public RoomName: string;
	public HasPassword: boolean;
	public Password: string;
	public IsAdmin: boolean;
	public Players: Dictionnary<OnlinePlayer>;
	public Player: OnlinePlayer;
	public Message: string;
	public MapSetting: MapSetting;
	public Messages: Message[] = [];
}
