import { InteractionInfo } from '../../Interaction/InteractionInfo';
import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';
import { RecordData } from './RecordData';
export class RecordJson {
	public MapContext: GameBlueprint;
	public Points: number[];
	public Hqs: any;
	public Cells: any;
	public Title: string;
	public RefDate: number;
	public Interactions: InteractionInfo[];

	public static To(data: RecordData): RecordJson {
		const players: any = {};
		data.Hqs.Keys().map((key) => {
			players[key] = data.Hqs.Get(key).GetJsonObject();
		});

		const json = new RecordJson();
		json.Title = `save_${new Date().toLocaleTimeString()}`;
		json.MapContext = data.MapContext;
		json.RefDate = data.RefDate;
		json.Cells = data.Cells.GetValues();
		json.Hqs = players;
		json.Interactions = data.Interactions;
		json.Points = data.Dates;
		return json;
	}
}
