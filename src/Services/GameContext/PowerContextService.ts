import { FireRenderer } from '../../Core/Framework/Render/Fire/PowerRenderer';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { FireContext } from '../../Core/Framework/Context/FireContext';
import { IGameContextService } from './IGameContextService';
import { GameState } from '../../Core/Framework/Context/GameState';

export class PowerContextService implements IGameContextService<FireBlueprint, FireContext> {
	private _gameContext: FireContext;

	Register(blueprint: FireBlueprint, gameState: GameState): void {
		this._gameContext = new FireRenderer().Render(blueprint, gameState);
	}
	Publish(): FireContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
