import { RecordObject } from './../../Core/Framework/Record/RecordObject';
export class PlayerProfil {
	public LastPlayerName: string = 'John doe';

	public Records: RecordObject[] = [];
	public Points: number = 0;

	//levels
	public TrainingLevel: number = 3;
	public BlueLevel: number = 0;
	public RedLevel: number = 1;

	//stats
	public CellCount: number = 0;
	public DeadCount: number = 0;
	constructor() {}
}
