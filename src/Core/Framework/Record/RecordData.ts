import { InteractionInfo } from './../../Interaction/InteractionInfo';
import { RecordCell } from './RecordCell';
import { RecordHq } from './RecordHq';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { RecordObject } from './RecordObject';
import { RecordUnit } from './RecordUnit';
import { MapContext } from '../../Setup/Generator/MapContext';
export class RecordData {
	public MapContext: MapContext;
	public Dates: number[] = [];
	public Hqs: Dictionnary<RecordHq> = new Dictionnary<RecordHq>();
	public Cells: Dictionnary<RecordCell> = new Dictionnary<RecordCell>();
	public Interactions: InteractionInfo[] = [];
	public Title: string;
	public Date: Date;
	constructor() {}

	public static To(origObject: RecordObject): RecordData {
		const copyObject = JSON.parse(JSON.stringify(origObject));

		const hqs = new Dictionnary<RecordHq>();
		hqs.SetValues(copyObject.Hqs);

		hqs.Values().forEach((hq) => {
			const units = hq.Units as any;
			hq.Units = new Dictionnary<RecordUnit>();
			hq.Units.SetValues(units);
		});

		const cells = new Dictionnary<RecordCell>();
		cells.SetValues(copyObject.Cells);

		const result = new RecordData();
		result.Hqs = hqs;
		result.Cells = cells;
		result.Dates = copyObject.Points;
		result.Title = copyObject.Title;
		result.Date = copyObject.Date;
		result.MapContext = copyObject.MapContext;
		return result;
	}
}
