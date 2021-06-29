import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { GameState } from '../../Core/Framework/Context/GameState';
import { GameRenderer } from '../../Core/Framework/Render/Game/GameRenderer';
import { IGameContextService } from './IGameContextService';

export class GameContextService implements IGameContextService<GameBlueprint, GameContext> {
	private _gameContext: GameContext;

	Register(blueprint: GameBlueprint, gameState: GameState): void {
		this._gameContext = new GameRenderer().Render(blueprint, gameState);
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
