import { GameBlueprint } from '../../Core/Setup/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Core/Setup/Context/GameContext';
import { GameRenderer } from '../../Core/Setup/Render/Game/GameRenderer';
import { IGameContextService } from './IGameContextService';

export class GameContextService implements IGameContextService<GameBlueprint, GameContext> {
	private _gameContext: GameContext;

	Register(mapContext: GameBlueprint): void {
		this._gameContext = new GameRenderer().Render(mapContext);
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
