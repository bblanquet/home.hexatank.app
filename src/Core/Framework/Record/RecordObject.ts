import { InteractionInfo } from './../../Interaction/InteractionInfo';
import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';
export class RecordObject {
	public MapContext: GameBlueprint;
	public Points: number[];
	public Hqs: any;
	public Cells: any;
	public Title: string;
	public Date: Date;
	public Interactions: InteractionInfo[];
}
