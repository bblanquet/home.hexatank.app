import { IBlueprint } from './../../Core/Setup/Blueprint/IBlueprint';
import { PowerBluePrintMaker } from './../../Core/Setup/Blueprint/Power/PowerBlueprintMaker';
import { CamouflageBluePrintMaker } from '../../Core/Setup/Blueprint/Cam/CamouflageBlueprintMaker';
import { DiamondBlueprintMaker } from './../../Core/Setup/Blueprint/Diamond/DiamondBlueprintMaker';
import { Factory, FactoryKey } from './../../Factory';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { GameBlueprintMaker } from '../../Core/Setup/Blueprint/Game/GameBlueprintMaker';
import { Dictionnary } from './../../Core/Utils/Collections/Dictionnary';
import { CampaignKind } from './CampaignKind';
import { GameBlueprint } from '../../Core/Setup/Blueprint/Game/GameBlueprint';
import { MapEnv } from '../../Core/Setup/Blueprint/MapEnv';
import { MapType } from '../../Core/Setup/Blueprint/MapType';
import { ICampaignService } from './ICampaignService';

export class CampaignService implements ICampaignService {
	private _training: Dictionnary<IBlueprint>;
	private _red: Dictionnary<GameBlueprint>;
	private _blue: Dictionnary<GameBlueprint>;
	private _playerProfil: IPlayerProfilService;

	constructor() {
		this._playerProfil = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);

		this._training = new Dictionnary<IBlueprint>();
		this._training.Add((1).toString(), new CamouflageBluePrintMaker().GetBluePrint());
		this._training.Add((2).toString(), new PowerBluePrintMaker().GetBluePrint());
		this._training.Add((3).toString(), new DiamondBlueprintMaker().GetBluePrint());

		this._red = new Dictionnary<GameBlueprint>();
		this._red.Add((1).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Flower, MapEnv.forest, 2));
		this._red.Add((2).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Donut, MapEnv.forest, 2));
		this._red.Add((3).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.H, MapEnv.forest, 2));
		this._red.Add((4).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Triangle, MapEnv.forest, 2));

		this._blue = new Dictionnary<GameBlueprint>();
		this._blue.Add((1).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Flower, MapEnv.sand, 2));
		this._blue.Add((2).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Donut, MapEnv.sand, 2));
		this._blue.Add((3).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.H, MapEnv.sand, 2));
		this._blue.Add((4).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Triangle, MapEnv.sand, 2));
	}

	public GetMapContext(kind: CampaignKind, index: number): any {
		let blueprint: GameBlueprint;

		if (kind === CampaignKind.red) {
			blueprint = this._red.Get(index.toString());
		} else if (kind === CampaignKind.blue) {
			blueprint = this._blue.Get(index.toString());
		} else if (kind === CampaignKind.training) {
			return this._training.Get(index.toString());
		}

		blueprint.PlayerName = this._playerProfil.GetProfil().LastPlayerName;
		if (blueprint.Hqs) {
			blueprint.Hqs[0].PlayerName = blueprint.PlayerName;
			blueprint.Hqs.forEach((hq, index) => {
				if (!hq.PlayerName) {
					hq.isIa = true;
					hq.PlayerName = `IA-${index}`;
				}
				index += 1;
			});
		}

		return blueprint;
	}

	public GetButtons(kind: CampaignKind): Array<boolean> {
		if (kind === CampaignKind.blue) {
			return this._blue.Values().map((e, index) => {
				return index < this._playerProfil.GetProfil().BlueLevel;
			});
		} else if (kind === CampaignKind.training) {
			return this._training.Values().map((e, index) => {
				return index < this._playerProfil.GetProfil().TrainingLevel;
			});
		} else {
			return this._blue.Values().map((e, index) => {
				return index < this._playerProfil.GetProfil().RedLevel;
			});
		}
	}
}
