import { FireworldMaker } from '../../Core/Framework/Worldmaker/Fire/FireworldMaker';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { Fireworld } from '../../Core/Framework/World/Fireworld';
import { IGameworldService } from './IGameworldService';
import { GameState } from '../../Core/Framework/World/GameState';

export class FireworldService implements IGameworldService<FireBlueprint, Fireworld> {
	private _gameworld: Fireworld;

	Register(blueprint: FireBlueprint, gameState: GameState): void {
		this._gameworld = new FireworldMaker().Make(blueprint, gameState);
	}
	Publish(): Fireworld {
		return this._gameworld;
	}

	Collect(): void {
		this._gameworld = null;
	}
}
