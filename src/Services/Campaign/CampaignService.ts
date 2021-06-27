import { IBlueprint } from './../../Core/Framework/Blueprint/IBlueprint';
import { PowerBluePrintMaker } from './../../Core/Framework/Blueprint/Power/PowerBlueprintMaker';
import { CamouflageBluePrintMaker } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprintMaker';
import { DiamondBlueprintMaker } from './../../Core/Framework/Blueprint/Diamond/DiamondBlueprintMaker';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { Dictionary } from '../../Core/Utils/Collections/Dictionary';
import { CampaignKind } from './CampaignKind';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapEnv } from '../../Core/Framework/Blueprint/Items/MapEnv';
import { MapType } from '../../Core/Framework/Blueprint/Items/MapType';
import { ICampaignService } from './ICampaignService';

export class CampaignService implements ICampaignService {
	private _training: Dictionary<IBlueprint>;
	private _red: Dictionary<GameBlueprint>;
	private _blue: Dictionary<GameBlueprint>;
	private _playerProfil: IPlayerProfilService;

	constructor() {
		this._playerProfil = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);

		this._training = new Dictionary<IBlueprint>();
		this._training.Add((1).toString(), new CamouflageBluePrintMaker().GetBluePrint());
		this._training.Add((2).toString(), new PowerBluePrintMaker().GetBluePrint());
		this._training.Add((3).toString(), new DiamondBlueprintMaker().GetBluePrint());

		this._red = new Dictionary<GameBlueprint>();
		this._red.Add((1).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Flower, MapEnv.forest, 2));
		this._red.Add((2).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Donut, MapEnv.forest, 2));
		this._red.Add((3).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.H, MapEnv.forest, 2));
		this._red.Add((4).toString(), new GameBlueprintMaker().GetBluePrint(+6, MapType.Triangle, MapEnv.forest, 2));

		this._blue = new Dictionary<GameBlueprint>();
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
