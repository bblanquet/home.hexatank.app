import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { OnlinePlayer } from '../OnlinePlayer';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { BlueprintSetup } from '../../Components/Components/Form/BlueprintSetup';
import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { ErrorHandler, ErrorCat } from '../../Utils/Exceptions/ErrorHandler';
import { HqAppearance } from '../../Core/Framework/Render/Hq/HqSkinHelper';
export class OnlineBlueprintMaker {
	constructor(private _onlinePlayerManager: IOnlinePlayerManager, private _blueprintSetup: BlueprintSetup) {}

	public GetBlueprint(): GameBlueprint {
		let hqCount = +this._blueprintSetup.IaCount + this._onlinePlayerManager.Players.Count();
		const mapContext = new GameBlueprintMaker().GetBluePrint(
			this.ConvertMapType(),
			this.ConvertEnv(),
			hqCount,
			HqAppearance.Colors
		);
		mapContext.PlayerName = this._onlinePlayerManager.Player.Name;
		this.AssignIa(mapContext);
		this.AssignHqToPlayer(mapContext, this._onlinePlayerManager.Players.Values());
		return mapContext;
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

	private AssignIa(blueprint: GameBlueprint): void {
		blueprint.Hqs.forEach((hq, index) => {
			hq.isIa = true;
			hq.PlayerName = `IA-${index}`;
			index += 1;
		});
	}

	private AssignHqToPlayer(blueprint: GameBlueprint, players: OnlinePlayer[]): void {
		if (blueprint.Hqs.length < players.length) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
		}
		blueprint.Hqs.forEach((hq, index) => {
			if (index < players.length) {
				hq.PlayerName = players[index].Name;
				hq.isIa = false;
			}
		});
	}
}
