import { InteractionInfo } from '../../../Interaction/InteractionInfo';
import { GameBlueprint } from '../../Blueprint/Game/GameBlueprint';
import { LogMessage } from '../../../Utils/Logger/LogMessage';
import { RecordContent } from './RecordContent';
export class RecordAny {
	public MapContext: GameBlueprint;
	public Points: number[];
	public Hqs: any;
	public Cells: any;
	public Title: string;
	public StartDate: number;
	public EndDate: number;
	public Interactions: InteractionInfo[];
	public Messages: LogMessage[];
	public IsVictory: boolean;
	public PlayerName: string;

	public static To(data: RecordContent): RecordAny {
		const players: any = {};
		data.Hqs.Keys().map((key) => {
			players[key] = data.Hqs.Get(key).GetJsonObject();
		});

		const json = new RecordAny();
		json.Title = `${data.PlayerName}_${new Date().toLocaleTimeString()}`;
		json.MapContext = data.MapContext;
		json.StartDate = data.StartDate;
		json.EndDate = data.EndDate;
		json.Cells = data.Cells.GetValues();
		json.Hqs = players;
		json.Points = data.Dates;
		json.Messages = data.Messages;
		json.PlayerName = data.PlayerName;
		json.IsVictory = data.IsVictory;
		return json;
	}
}
