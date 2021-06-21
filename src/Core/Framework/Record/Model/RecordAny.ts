import { InteractionInfo } from '../../../Interaction/InteractionInfo';
import { GameBlueprint } from '../../../Setup/Blueprint/Game/GameBlueprint';
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

	public static To(data: RecordContent): RecordAny {
		const players: any = {};
		data.Hqs.Keys().map((key) => {
			players[key] = data.Hqs.Get(key).GetJsonObject();
		});

		const json = new RecordAny();
		json.Title = `save_${new Date().toLocaleTimeString()}`;
		json.MapContext = data.MapContext;
		json.StartDate = data.StartDate;
		json.EndDate = data.EndDate;
		json.Cells = data.Cells.GetValues();
		json.Hqs = players;
		json.Interactions = data.Interactions;
		json.Points = data.Dates;
		return json;
	}
}
