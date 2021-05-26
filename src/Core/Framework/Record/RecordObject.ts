import { InteractionInfo } from './../../Interaction/InteractionInfo';
import { MapContext } from '../../Setup/Generator/MapContext';
export class RecordObject {
	public MapContext: MapContext;
	public Points: number[];
	public Hqs: any;
	public Cells: any;
	public Title: string;
	public Date: Date;
	public Interactions: InteractionInfo[];
}
