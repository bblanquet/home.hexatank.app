import { SmallBlueprint } from '../../Core/Framework/Blueprint/Small/SmallBlueprint';
import { IGameworldService } from './IGameworldService';
import { GameState } from '../../Core/Framework/World/GameState';
import { FireworldMaker } from '../../Core/Framework/Worldmaker/Fire/FireworldMaker';
import { Fireworld } from '../../Core/Framework/World/Fireworld';

export class FireV2worldService implements IGameworldService<SmallBlueprint, Fireworld> {
	private _gameworld: Fireworld;

	Register(blueprint: SmallBlueprint, gameState: GameState): void {
		this._gameworld = new FireworldMaker().Make(blueprint, gameState);
	}
	Publish(): Fireworld {
		return this._gameworld;
	}

	Collect(): void {
		this._gameworld = null;
	}
}
