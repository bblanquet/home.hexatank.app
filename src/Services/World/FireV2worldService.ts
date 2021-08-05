import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { IGameworldService } from './IGameworldService';
import { GameState } from '../../Core/Framework/World/GameState';
import { FireV2worldMaker } from '../../Core/Framework/Worldmaker/FireV2/FireV2worldMaker';
import { FireV2World } from '../../Core/Framework/World/FireV2World';

export class FireV2worldService implements IGameworldService<FireBlueprint, FireV2World> {
	private _gameworld: FireV2World;

	Register(blueprint: FireBlueprint, gameState: GameState): void {
		this._gameworld = new FireV2worldMaker().Make(blueprint, gameState);
	}
	Publish(): FireV2World {
		return this._gameworld;
	}

	Collect(): void {
		this._gameworld = null;
	}
}
