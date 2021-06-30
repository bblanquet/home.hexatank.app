import { GameBlueprint } from '../../Blueprint/Game/GameBlueprint';
import { LogMessage } from '../../../../Utils/Logger/LogMessage';
import { RecordContent } from './RecordContent';
export class JsonRecordContent {
	public Blueprint: GameBlueprint;
	public Dates: number[];
	public Hqs: any;
	public Cells: any;
	public Title: string;
	public StartDate: number;
	public EndDate: number;
	public Messages: LogMessage[];
	public IsVictory: boolean;
	public PlayerName: string;

	public static To(record: RecordContent, updateTitle: boolean = true): JsonRecordContent {
		const players: any = {};
		record.Hqs.Keys().map((key) => {
			players[key] = record.Hqs.Get(key).ToJsonObj();
		});

		const jsonCopy = new JsonRecordContent();
		if (updateTitle) {
			jsonCopy.Title = `${record.PlayerName}_${new Date().toLocaleTimeString()}`;
		} else {
			jsonCopy.Title = record.Title;
		}
		jsonCopy.Blueprint = record.Blueprint;
		jsonCopy.StartDate = record.StartDate;
		jsonCopy.EndDate = record.EndDate;
		jsonCopy.Cells = record.Cells.GetValues();
		jsonCopy.Hqs = players;
		jsonCopy.Dates = record.Dates;
		jsonCopy.Messages = record.Messages;
		jsonCopy.PlayerName = record.PlayerName;
		jsonCopy.IsVictory = record.IsVictory;
		return jsonCopy;
	}
}
