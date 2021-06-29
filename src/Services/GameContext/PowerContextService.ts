import { PowerRenderer } from './../../Core/Framework/Render/PowerRenderer/PowerRenderer';
import { PowerBlueprint } from './../../Core/Framework/Blueprint/Power/PowerBlueprint';
import { PowerContext } from './../../Core/Framework/Context/PowerContext';
import { IGameContextService } from './IGameContextService';
import { GameState } from '../../Core/Framework/Context/GameState';

export class PowerContextService implements IGameContextService<PowerBlueprint, PowerContext> {
	private _gameContext: PowerContext;

	Register(blueprint: PowerBlueprint, gameState: GameState): void {
		this._gameContext = new PowerRenderer().Render(blueprint, gameState);
	}
	Publish(): PowerContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
