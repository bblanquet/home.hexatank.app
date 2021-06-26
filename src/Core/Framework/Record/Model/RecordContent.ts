import { RecordCell } from './Item/RecordCell';
import { RecordHq } from './RecordHq';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { RecordAny } from './RecordAny';
import { RecordUnit } from './Item/RecordUnit';
import { GameBlueprint } from '../../../Setup/Blueprint/Game/GameBlueprint';
import { LogMessage } from '../../../Utils/Logger/LogMessage';
export class RecordContent {
	public MapContext: GameBlueprint;
	public Dates: number[] = [];
	public Hqs: Dictionary<RecordHq> = new Dictionary<RecordHq>();
	public Cells: Dictionary<RecordCell> = new Dictionary<RecordCell>();
	public Title: string;
	public PlayerName: string;
	public StartDate: number;
	public EndDate: number;
	public IsVictory: boolean;
	public Messages: LogMessage[] = [];
	constructor() {}

	public static To(origObject: RecordAny): RecordContent {
		const copyObject = JSON.parse(JSON.stringify(origObject));

		const hqs = new Dictionary<RecordHq>();
		hqs.SetValues(copyObject.Hqs);

		hqs.Values().forEach((hq) => {
			const units = hq.Units as any;
			hq.Units = new Dictionary<RecordUnit>();
			hq.Units.SetValues(units);
		});

		const cells = new Dictionary<RecordCell>();
		cells.SetValues(copyObject.Cells);

		const result = new RecordContent();
		result.StartDate = copyObject.StartDate;
		result.EndDate = copyObject.EndDate;
		result.Hqs = hqs;
		result.Cells = cells;
		result.Dates = copyObject.Points;
		result.Title = copyObject.Title;
		result.MapContext = copyObject.MapContext;
		result.Messages = copyObject.Messages;
		result.PlayerName = copyObject.PlayerName;
		result.IsVictory = copyObject.IsVictory;
		return result;
	}
}
