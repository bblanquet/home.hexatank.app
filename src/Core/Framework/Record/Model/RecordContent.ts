import { RecordCell } from './Item/RecordCell';
import { RecordHq } from './RecordHq';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { JsonRecordContent } from './JsonRecordContent';
import { GameBlueprint } from '../../../Framework/Blueprint/Game/GameBlueprint';
import { LogMessage } from '../../../../Utils/Logger/LogMessage';
export class RecordContent {
	public Blueprint: GameBlueprint;
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

	public static To(origObject: JsonRecordContent): RecordContent {
		const jsonCopy: JsonRecordContent = JSON.parse(JSON.stringify(origObject));

		const newHqs = new Dictionary<RecordHq>();
		for (var key in jsonCopy.Hqs) {
			const copyHq = jsonCopy.Hqs[key];
			newHqs.Add(copyHq.Name, new RecordHq(copyHq.Name, copyHq.Color));
			newHqs.Get(copyHq.Name).Units.SetValues(copyHq.Units);
		}

		const cells = new Dictionary<RecordCell>();
		cells.SetValues(jsonCopy.Cells);

		const record = new RecordContent();
		record.StartDate = jsonCopy.StartDate;
		record.EndDate = jsonCopy.EndDate;
		record.Hqs = newHqs;
		record.Cells = cells;
		record.Dates = jsonCopy.Dates;
		record.Title = jsonCopy.Title;
		record.Blueprint = jsonCopy.Blueprint;
		record.Messages = jsonCopy.Messages;
		record.PlayerName = jsonCopy.PlayerName;
		record.IsVictory = jsonCopy.IsVictory;
		return record;
	}
}
