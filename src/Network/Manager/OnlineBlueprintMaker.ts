import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { OnlinePlayer } from '../OnlinePlayer';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { BlueprintSetup } from '../../UI/Components/Form/BlueprintSetup';
import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { ErrorHandler, ErrorCat } from '../../Core/Utils/Exceptions/ErrorHandler';
export class OnlineBlueprintMaker {
	constructor(private _onlinePlayerManager: IOnlinePlayerManager, private _blueprintSetup: BlueprintSetup) {}

	public GetBlueprint(): GameBlueprint {
		let hqCount = +this._blueprintSetup.IaCount + this._onlinePlayerManager.Players.Count();
		if (this.ConvertSize() === 8 && 3 < hqCount) {
			this._blueprintSetup.Size = 'Large';
		} else if (this.ConvertSize() === 8 && 2 < hqCount) {
			this._blueprintSetup.Size = 'Medium';
		}
		const mapContext = new GameBlueprintMaker().GetBluePrint(
			this.ConvertSize(),
			this.ConvertMapType(),
			this.ConvertEnv(),
			hqCount
		);
		mapContext.PlayerName = this._onlinePlayerManager.Player.Name;
		this.AssignIa(mapContext);
		this.AssignHqToPlayer(mapContext, this._onlinePlayerManager.Players.Values());
		return mapContext;
	}

	private ConvertMapType(): MapShape {
		if (this._blueprintSetup.MapType === 'Flower') return MapShape.Flower;
		if (this._blueprintSetup.MapType === 'Donut') return MapShape.Donut;
		if (this._blueprintSetup.MapType === 'Cheese') return MapShape.Cheese;
		if (this._blueprintSetup.MapType === 'Triangle') return MapShape.Triangle;
		if (this._blueprintSetup.MapType === 'Y') return MapShape.Y;
		if (this._blueprintSetup.MapType === 'H') return MapShape.H;
		if (this._blueprintSetup.MapType === 'X') return MapShape.X;
		return MapShape.Rectangle;
	}

	private ConvertSize(): number {
		if (this._blueprintSetup.Size === 'Small') return 8;
		if (this._blueprintSetup.Size === 'Medium') return 10;
		if (this._blueprintSetup.Size === 'Large') return 12;
		return 8;
	}

	private ConvertEnv(): MapKind {
		if (this._blueprintSetup.Env === 'Sand') return MapKind.sand;
		if (this._blueprintSetup.Env === 'Forest') return MapKind.forest;
		if (this._blueprintSetup.Env === 'Ice') return MapKind.ice;
		return MapKind.forest;
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
