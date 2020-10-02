import { Player } from '../../Network/Player';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';

export class HostState {
	public RoomName: string;
	public IsAdmin: boolean;
	public Players: Dictionnary<Player>;
	public Player: Player;
	public Message: string;
	public IaNumber: number;
}
