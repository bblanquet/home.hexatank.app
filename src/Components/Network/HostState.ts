import { MapSetting } from './../Form/MapSetting';
import { Player } from '../../Network/Player';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';

export class HostState {
	public RoomName: string;
	public HasPassword: boolean;
	public Password: string;
	public IsAdmin: boolean;
	public Players: Dictionnary<Player>;
	public Player: Player;
	public Message: string;
	public MapSetting: MapSetting;
}
