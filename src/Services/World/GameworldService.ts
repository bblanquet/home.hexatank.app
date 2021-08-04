import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { GameState } from '../../Core/Framework/World/GameState';
import { GameworldMaker } from '../../Core/Framework/Worldmaker/Game/GameworldMaker';
import { IGameworldService } from './IGameworldService';

export class GameworldService implements IGameworldService<GameBlueprint, Gameworld> {
	private _gameContext: Gameworld;

	Register(blueprint: GameBlueprint, gameState: GameState): void {
		this._gameContext = new GameworldMaker().Make(blueprint, gameState);
	}
	Publish(): Gameworld {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
