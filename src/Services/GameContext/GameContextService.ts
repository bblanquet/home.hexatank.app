import { BattleBlueprint } from './../../Core/Setup/Blueprint/Battle/BattleBlueprint';
import { GameContext } from './../../Core/Framework/GameContext';
import { BattleRenderer } from '../../Core/Setup/Render/BattleRenderer/BattleRenderer';
import { IGameContextService } from './IGameContextService';

export class GameContextService implements IGameContextService<BattleBlueprint, GameContext> {
	private _gameContext: GameContext;

	Register(mapContext: BattleBlueprint): void {
		this._gameContext = new BattleRenderer().Render(mapContext);
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
