import { InteractionInfo } from '../../../Interaction/InteractionInfo';
import { RecordCell } from './Item/RecordCell';
import { RecordHq } from './RecordHq';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { RecordAny } from './RecordAny';
import { RecordUnit } from './Item/RecordUnit';
import { GameBlueprint } from '../../../Setup/Blueprint/Game/GameBlueprint';
export class RecordContent {
	public MapContext: GameBlueprint;
	public Dates: number[] = [];
	public Hqs: Dictionnary<RecordHq> = new Dictionnary<RecordHq>();
	public Cells: Dictionnary<RecordCell> = new Dictionnary<RecordCell>();
	public Interactions: InteractionInfo[] = [];
	public Title: string;
	public StartDate: number;
	public EndDate: number;
	constructor() {}

	public static To(origObject: RecordAny): RecordContent {
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

		const result = new RecordContent();
		result.StartDate = copyObject.StartDate;
		result.EndDate = copyObject.EndDate;
		result.Hqs = hqs;
		result.Cells = cells;
		result.Dates = copyObject.Points;
		result.Title = copyObject.Title;
		result.MapContext = copyObject.MapContext;
		return result;
	}
}
