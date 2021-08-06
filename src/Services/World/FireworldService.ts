import { MultioutpostworlMaker } from '../../Core/Framework/Worldmaker/Multioutpost/MultioutpostworlMaker';
import { SmallBlueprint } from '../../Core/Framework/Blueprint/Small/SmallBlueprint';
import { Multioutpostworld } from '../../Core/Framework/World/Multioutpostworld';
import { IGameworldService } from './IGameworldService';
import { GameState } from '../../Core/Framework/World/GameState';

export class FireworldService implements IGameworldService<SmallBlueprint, Multioutpostworld> {
	private _gameworld: Multioutpostworld;

	Register(blueprint: SmallBlueprint, gameState: GameState): void {
		this._gameworld = new MultioutpostworlMaker().Make(blueprint, gameState);
	}
	Publish(): Multioutpostworld {
		return this._gameworld;
	}

	Collect(): void {
		this._gameworld = null;
	}
}
