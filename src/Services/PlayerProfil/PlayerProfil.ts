import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { StageState } from '../../Services/Campaign/StageState';
export class PlayerProfil {
	public LastPlayerName: string = 'John doe';
	public IsMute: boolean = false;

	public Records: JsonRecordContent[] = [];
	public Points: number = 0;

	//levels
	public GreenLvl: StageState[] = [ StageState.unlock, StageState.unlock, StageState.unlock ];
	public RedLvl: StageState[] = [ StageState.achieved, StageState.unlock, StageState.lock, StageState.lock ];
	public BlueLvl: StageState[] = [ StageState.lock, StageState.lock, StageState.lock, StageState.lock ];

	//stats
	public CellCount: number = 0;
	public DeadCount: number = 0;
	public VictoryCount: number = 0;
}
