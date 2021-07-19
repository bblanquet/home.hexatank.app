import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { BlueprintSetup } from '../../Components/Model/BlueprintSetup';
import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { HqAppearance } from '../../Core/Framework/Render/Hq/HqSkinHelper';
import { PlayerBlueprint } from '../../Core/Framework/Blueprint/Game/HqBlueprint';
import { BrainKind } from '../../Core/Ia/Decision/BrainKind';
export class OnlineBlueprintMaker {
	constructor(private _onlinePlayerManager: IOnlinePlayerManager, private _blueprintSetup: BlueprintSetup) {}

	public GetBlueprint(): GameBlueprint {
		const players = new Array<PlayerBlueprint>();
		let index = 0;
		this._blueprintSetup.IAs.forEach((ia) => {
			players.push(new PlayerBlueprint(`IA${index}`, HqAppearance.Colors[index], false, this.ConvertBrain(ia)));
			index++;
		});
		this._onlinePlayerManager.Players.Values().forEach((pl) => {
			players.push(
				new PlayerBlueprint(
					pl.Name,
					HqAppearance.Colors[index],
					pl.Name === this._onlinePlayerManager.Player.Name
				)
			);
			index++;
		});

		return new GameBlueprintMaker().GetBluePrint(this.ConvertMapType(), this.ConvertEnv(), players);
	}

	private ConvertMapType(): MapShape {
		if (this._blueprintSetup.Shape === 'Flower') return MapShape.Flower;
		if (this._blueprintSetup.Shape === 'Donut') return MapShape.Donut;
		if (this._blueprintSetup.Shape === 'Cheese') return MapShape.Cheese;
		if (this._blueprintSetup.Shape === 'Triangle') return MapShape.Triangle;
		if (this._blueprintSetup.Shape === 'Y') return MapShape.Y;
		if (this._blueprintSetup.Shape === 'H') return MapShape.H;
		if (this._blueprintSetup.Shape === 'X') return MapShape.X;
		return MapShape.Rectangle;
	}

	private ConvertEnv(): MapKind {
		if (this._blueprintSetup.Env === 'Sand') return MapKind.Sand;
		if (this._blueprintSetup.Env === 'Forest') return MapKind.Forest;
		if (this._blueprintSetup.Env === 'Ice') return MapKind.Ice;
		return MapKind.Forest;
	}

	private ConvertBrain(ia: string): BrainKind {
		if (ia === 'Bob') return BrainKind.Bob;
		if (ia === 'Simple') return BrainKind.Simple;
		if (ia === 'Dummy') return BrainKind.Dummy;
		return BrainKind.Bob;
	}
}
