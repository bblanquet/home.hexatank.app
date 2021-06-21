import { RecordAny } from '../../Core/Framework/Record/Model/RecordAny';
export class PlayerProfil {
	public LastPlayerName: string = 'John doe';
	public IsMute: boolean = false;

	public Records: RecordAny[] = [];
	public Points: number = 0;

	//levels
	public TrainingLevel: number = 3;
	public BlueLevel: number = 0;
	public RedLevel: number = 1;

	//stats
	public CellCount: number = 0;
	public DeadCount: number = 0;
	public VictoryCount: number = 0;
	constructor() {}
}
