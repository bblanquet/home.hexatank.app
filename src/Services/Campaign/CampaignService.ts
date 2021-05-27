import { Factory, FactoryKey } from './../../Factory';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { MapGenerator } from './../../Core/Setup/Generator/MapGenerator';
import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { CampaignKind } from './CampaignKind';
import { MapContext } from './../../Core/Setup/Generator/MapContext';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import { MapType } from '../../Core/Setup/Generator/MapType';
import { ICampaignService } from './ICampaignService';

export class CampaignService implements ICampaignService {
	private _training: Dictionnary<MapContext>;
	private _red: Dictionnary<MapContext>;
	private _blue: Dictionnary<MapContext>;
	private _modelService: IPlayerProfilService;

	constructor() {
		this._modelService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);

		this._training = new Dictionnary<MapContext>();
		this._training.Add((1).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Rectangle, MapEnv.forest));

		this._red = new Dictionnary<MapContext>();
		this._red.Add((1).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Flower, MapEnv.forest, 2));
		this._red.Add((2).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Donut, MapEnv.forest, 2));
		this._red.Add((3).toString(), new MapGenerator().GetMapDefinition(+6, MapType.H, MapEnv.forest, 2));
		this._red.Add((4).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Triangle, MapEnv.forest, 2));

		this._blue = new Dictionnary<MapContext>();
		this._blue.Add((1).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Flower, MapEnv.sand, 2));
		this._blue.Add((2).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Donut, MapEnv.sand, 2));
		this._blue.Add((3).toString(), new MapGenerator().GetMapDefinition(+6, MapType.H, MapEnv.sand, 2));
		this._blue.Add((4).toString(), new MapGenerator().GetMapDefinition(+6, MapType.Triangle, MapEnv.sand, 2));
	}

	public GetMapContext(kind: CampaignKind, index: number): MapContext {
		let mapContext: MapContext;

		if (kind === CampaignKind.red) {
			mapContext = this._red.Get(index.toString());
		} else if (kind === CampaignKind.blue) {
			mapContext = this._blue.Get(index.toString());
		} else if (kind === CampaignKind.training) {
			mapContext = this._training.Get(index.toString());
		}

		if (mapContext.Hqs) {
			mapContext.Hqs[0].PlayerName = mapContext.PlayerName;
			mapContext.Hqs.forEach((hq, index) => {
				if (!hq.PlayerName) {
					hq.isIa = true;
					hq.PlayerName = `IA-${index}`;
				}
				index += 1;
			});
		}

		return mapContext;
	}

	public GetButtons(kind: CampaignKind): Array<boolean> {
		if (kind === CampaignKind.blue) {
			return this._blue.Values().map((e, index) => {
				return index < this._modelService.GetProfil().BlueLevel;
			});
		} else if (kind === CampaignKind.training) {
			return this._training.Values().map((e, index) => {
				return index < this._modelService.GetProfil().TrainingLevel;
			});
		} else {
			return this._blue.Values().map((e, index) => {
				return index < this._modelService.GetProfil().RedLevel;
			});
		}
	}
}
