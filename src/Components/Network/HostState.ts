import { GameSettings } from './../../Core/Framework/GameSettings';
import { Player } from '../../Network/Player';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';

export class HostState {
	public RoomName: string;
	public IsAdmin: boolean;
	public Players: Dictionnary<Player>;
	public Settings: GameSettings;
	public Player: Player;
	public Message: string;
	public IaNumber: number;
}
