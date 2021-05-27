import { InteractionInfo } from './../../Interaction/InteractionInfo';
import { BattleBlueprint } from '../../Setup/Blueprint/Battle/BattleBlueprint';
export class RecordObject {
	public MapContext: BattleBlueprint;
	public Points: number[];
	public Hqs: any;
	public Cells: any;
	public Title: string;
	public Date: Date;
	public Interactions: InteractionInfo[];
}
