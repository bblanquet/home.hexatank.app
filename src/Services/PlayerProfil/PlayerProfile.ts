import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { PlayerDetails } from './PlayerDetails';
import { Token } from './Token';
export class PlayerProfile {
	public CurrentVersion: number = 1.5;
	public static Version: number = 1.5;
	public Token: Token = null;
	public Details: PlayerDetails = new PlayerDetails();
	public History: JsonRecordContent[] = [];
	public IsMute: boolean = false;
}
