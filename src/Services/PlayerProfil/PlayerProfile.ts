import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { StageState } from '../Campaign/StageState';
export class PlayerProfile {
	public LastPlayerName: string = 'John doe';
	public Version: number = 1.3;
	public static Version: number = 1.3;
	public IsMute: boolean = false;

	public Records: JsonRecordContent[] = [];
	public Points: number = 0;

	//levels
	public GreenLvl: StageState[] = [ StageState.unlock, StageState.unlock, StageState.unlock, StageState.unlock ];
	public RedLvl: StageState[] = [ StageState.unlock, StageState.lock, StageState.lock, StageState.lock ];
	public BlueLvl: StageState[] = [ StageState.unlock, StageState.lock, StageState.lock, StageState.lock ];

	//stats
	public CellCount: number = 0;
	public DeadCount: number = 0;
	public VictoryCount: number = 0;
}
