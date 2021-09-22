import { IBlueprint } from './../../Core/Framework/Blueprint/IBlueprint';
import { SmallBlueprintMaker } from '../../Core/Framework/Blueprint/Small/SmallBlueprintMaker';
import { CamouflageBluePrintMaker } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprintMaker';
import { DiamondBlueprintMaker } from './../../Core/Framework/Blueprint/Diamond/DiamondBlueprintMaker';
import { Singletons, SingletonKey } from '../../Singletons';
import { IPlayerProfileService } from '../PlayerProfil/IPlayerProfileService';
import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { CampaignKind } from './CampaignKind';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { ICampaignService } from './ICampaignService';
import { StageState } from './StageState';
import { ColorKind } from '../../Components/Common/Button/Stylish/ColorKind';
import { PlayerBlueprint } from '../../Core/Framework/Blueprint/Game/HqBlueprint';
import { BrainKind } from '../../Core/Ia/Decision/BrainKind';

export class CampaignService implements ICampaignService {
	private _green: Dictionary<IBlueprint>;
	private _red: Dictionary<GameBlueprint>;
	private _blue: Dictionary<GameBlueprint>;
	private _playerProfil: IPlayerProfileService;

	constructor() {
		this._playerProfil = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		const playername = this._playerProfil.GetProfile().Details.name;

		this._green = new Dictionary<IBlueprint>();
		this._green.Add((1).toString(), new CamouflageBluePrintMaker().GetBluePrint());
		this._green.Add((2).toString(), new SmallBlueprintMaker().GetBluePrint(MapKind.Sand));
		this._green.Add((3).toString(), new SmallBlueprintMaker().GetBluePrint(MapKind.Forest));
		this._green.Add((4).toString(), new DiamondBlueprintMaker().GetBluePrint());
		this._green.Add((5).toString(), new SmallBlueprintMaker().GetBluePrint(MapKind.Forest));

		this._red = new Dictionary<GameBlueprint>();
		this._red.Add(
			(1).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.Flower, MapKind.Forest, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Red, false, BrainKind.Weak)
			])
		);
		this._red.Add(
			(2).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.Donut, MapKind.Forest, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Red, false, BrainKind.Weak)
			])
		);
		this._red.Add(
			(3).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.Cheese, MapKind.Forest, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Red, false, BrainKind.Normal)
			])
		);
		this._red.Add(
			(4).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.Triangle, MapKind.Forest, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Red, false, BrainKind.Normal)
			])
		);

		this._blue = new Dictionary<GameBlueprint>();
		this._blue.Add(
			(1).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.X, MapKind.Ice, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Blue, false, BrainKind.Normal)
			])
		);
		this._blue.Add(
			(2).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.Donut, MapKind.Ice, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Blue, false, BrainKind.Normal)
			])
		);
		this._blue.Add(
			(3).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.H, MapKind.Ice, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Blue, false, BrainKind.Strong)
			])
		);
		this._blue.Add(
			(4).toString(),
			new GameBlueprintMaker().GetBluePrint(MapShape.Rectangle, MapKind.Ice, [
				new PlayerBlueprint(playername, ColorKind.Yellow, true, BrainKind.Truck),
				new PlayerBlueprint('IA', ColorKind.Blue, false, BrainKind.Strong)
			])
		);
	}

	public GetBlueprint(kind: CampaignKind, lvl: number): IBlueprint {
		let blueprint: GameBlueprint;

		if (kind === CampaignKind.red) {
			blueprint = this._red.Get(lvl.toString());
		} else if (kind === CampaignKind.blue) {
			blueprint = this._blue.Get(lvl.toString());
		} else if (kind === CampaignKind.green) {
			return this._green.Get(lvl.toString());
		}
		return blueprint;
	}

	public GetStages(kind: CampaignKind): StageState[] {
		if (kind === CampaignKind.blue) {
			return this.Stages(this._playerProfil.GetProfile().Details.blue, this._blue.Count());
		} else if (kind === CampaignKind.green) {
			return this.Stages(this._playerProfil.GetProfile().Details.green, this._green.Count());
		} else {
			return this.Stages(this._playerProfil.GetProfile().Details.red, this._red.Count());
		}
	}
	private Stages(value: number, count: number): StageState[] {
		const result = new Array<StageState>();
		for (let i = 0; i < this._blue.Count(); i++) {
			if (i < value) {
				result.push(StageState.achieved);
			} else if (i === value) {
				result.push(StageState.unlock);
			} else {
				result.push(StageState.lock);
			}
		}
		return result;
	}
}
