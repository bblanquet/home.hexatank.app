import { GameSettings } from './../Core/Framework/GameSettings';
import { Dictionnary } from './../Core/Utils/Collections/Dictionnary';
import { Player } from './Player';

export class HostState {
	public RoomName: string;
	public IsAdmin: boolean;
	public Players: Dictionnary<Player>;
	public Settings: GameSettings;
	public Player: Player;
	public Message: string;
	public IaNumber: number;
}
