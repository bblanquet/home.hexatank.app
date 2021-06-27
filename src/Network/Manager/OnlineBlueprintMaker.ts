import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { OnlinePlayer } from '../OnlinePlayer';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { MapType } from '../../Core/Framework/Blueprint/Items/MapType';
import { MapEnv } from '../../Core/Framework/Blueprint/Items/MapEnv';
import { BlueprintSetup } from '../../Components/Form/BlueprintSetup';
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

	private ConvertMapType(): MapType {
		if (this._blueprintSetup.MapType === 'Flower') return MapType.Flower;
		if (this._blueprintSetup.MapType === 'Donut') return MapType.Donut;
		if (this._blueprintSetup.MapType === 'Cheese') return MapType.Cheese;
		if (this._blueprintSetup.MapType === 'Triangle') return MapType.Triangle;
		if (this._blueprintSetup.MapType === 'Y') return MapType.Y;
		if (this._blueprintSetup.MapType === 'H') return MapType.H;
		if (this._blueprintSetup.MapType === 'X') return MapType.X;
		return MapType.Rectangle;
	}

	private ConvertSize(): number {
		if (this._blueprintSetup.Size === 'Small') return 8;
		if (this._blueprintSetup.Size === 'Medium') return 10;
		if (this._blueprintSetup.Size === 'Large') return 12;
		return 8;
	}

	private ConvertEnv(): MapEnv {
		if (this._blueprintSetup.Env === 'Sand') return MapEnv.sand;
		if (this._blueprintSetup.Env === 'Forest') return MapEnv.forest;
		if (this._blueprintSetup.Env === 'Ice') return MapEnv.ice;
		return MapEnv.forest;
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
