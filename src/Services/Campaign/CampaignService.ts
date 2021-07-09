import { IBlueprint } from './../../Core/Framework/Blueprint/IBlueprint';
import { FireBluePrintMaker } from '../../Core/Framework/Blueprint/Fire/FireBluePrintMaker';
import { CamouflageBluePrintMaker } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprintMaker';
import { DiamondBlueprintMaker } from './../../Core/Framework/Blueprint/Diamond/DiamondBlueprintMaker';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfilService } from '../PlayerProfil/IPlayerProfilService';
import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { CampaignKind } from './CampaignKind';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { ICampaignService } from './ICampaignService';
import { BlueprintSetup } from '../../Components/Components/Form/BlueprintSetup';
import { StageState } from './StageState';
import { ColorKind } from '../../Components/Common/Button/Stylish/ColorKind';

export class CampaignService implements ICampaignService {
	private _training: Dictionary<IBlueprint>;
	private _red: Dictionary<GameBlueprint>;
	private _blue: Dictionary<GameBlueprint>;
	private _playerProfil: IPlayerProfilService;

	constructor() {
		this._playerProfil = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);

		this._training = new Dictionary<IBlueprint>();
		this._training.Add((1).toString(), new CamouflageBluePrintMaker().GetBluePrint());
		this._training.Add((2).toString(), new FireBluePrintMaker().GetBluePrint());
		this._training.Add((3).toString(), new DiamondBlueprintMaker().GetBluePrint());

		this._red = new Dictionary<GameBlueprint>();
		this._red.Add(
			(1).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.Flower, MapKind.Forest, 2, [
				ColorKind.Yellow,
				ColorKind.Red
			])
		);
		this._red.Add(
			(2).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.Donut, MapKind.Forest, 2, [
				ColorKind.Yellow,
				ColorKind.Red
			])
		);
		this._red.Add(
			(3).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.H, MapKind.Forest, 2, [
				ColorKind.Yellow,
				ColorKind.Red
			])
		);
		this._red.Add(
			(4).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.Triangle, MapKind.Forest, 2, [
				ColorKind.Yellow,
				ColorKind.Red
			])
		);

		this._blue = new Dictionary<GameBlueprint>();
		this._blue.Add(
			(1).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.Flower, MapKind.Ice, 2, [
				ColorKind.Yellow,
				ColorKind.Blue
			])
		);
		this._blue.Add(
			(2).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.Donut, MapKind.Ice, 2, [
				ColorKind.Yellow,
				ColorKind.Blue
			])
		);
		this._blue.Add(
			(3).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.H, MapKind.Ice, 2, [ ColorKind.Yellow, ColorKind.Blue ])
		);
		this._blue.Add(
			(4).toString(),
			new GameBlueprintMaker().GetBluePrint(+6, MapShape.Triangle, MapKind.Ice, 2, [
				ColorKind.Yellow,
				ColorKind.Blue
			])
		);
	}

	public Do(): void {
		new BlueprintSetup();
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

	public GetStages(kind: CampaignKind): StageState[] {
		if (kind === CampaignKind.blue) {
			return this._playerProfil.GetProfil().BlueLvl;
		} else if (kind === CampaignKind.training) {
			return this._playerProfil.GetProfil().GreenLvl;
		} else {
			return this._playerProfil.GetProfil().RedLvl;
		}
	}
}
