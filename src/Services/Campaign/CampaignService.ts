import { Factory, FactoryKey } from './../../Factory';
import { IModelService } from './../Model/IModelService';
import { MapGenerator } from './../../Core/Setup/Generator/MapGenerator';
import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { CampaignKind } from './CampaignKind';
import { MapContext } from './../../Core/Setup/Generator/MapContext';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import { MapType } from '../../Core/Setup/Generator/MapType';
import { ICampaignService } from './ICampaignService';

export class CampaignService implements ICampaignService {
	private _red: Dictionnary<MapContext>;
	private _blue: Dictionnary<MapContext>;
	private _modelService: IModelService;

	constructor() {
		this._modelService = Factory.Load<IModelService>(FactoryKey.Model);

		this._red = new Dictionnary<MapContext>();
		this._red.Add((1).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Flower, 2, MapEnv.forest));
		this._red.Add((2).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Donut, 2, MapEnv.forest));
		this._red.Add((3).toString(), new MapGenerator().GetMapDefinition(+6, MapType.H, 2, MapEnv.forest));
		this._red.Add((4).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Triangle, 2, MapEnv.forest));

		this._blue = new Dictionnary<MapContext>();
		this._blue.Add((1).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Flower, 2, MapEnv.sand));
		this._blue.Add((2).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Donut, 2, MapEnv.sand));
		this._blue.Add((3).toString(), new MapGenerator().GetMapDefinition(+6, MapType.H, 2, MapEnv.sand));
		this._blue.Add((4).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Triangle, 2, MapEnv.sand));
	}

	public GetMapContext(kind: CampaignKind, index: number): MapContext {
		let mapContext: MapContext =
			kind === CampaignKind.blue ? this._blue.Get(index.toString()) : this._red.Get(index.toString());

		mapContext.Hqs[0].PlayerName = mapContext.PlayerName;
		mapContext.Hqs.forEach((hq, index) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		return mapContext;
	}

	public GetButtons(kind: CampaignKind): Array<boolean> {
		if (kind === CampaignKind.blue) {
			return this._blue.Values().map((e, index) => {
				return index < this._modelService.GetModel().BlueCampaign;
			});
		} else {
			return this._blue.Values().map((e, index) => {
				return index < this._modelService.GetModel().RedCampaign;
			});
		}
	}
}
