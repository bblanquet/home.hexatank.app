import { DiamondBlueprint } from './../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Core/Framework/Context/DiamondContext';
import { IGameContextService } from './IGameContextService';
import { DiamondRenderer } from '../../Core/Framework/Render/Diamond/DiamondRenderer';
import { GameState } from '../../Core/Framework/Context/GameState';

export class DiamondContextService implements IGameContextService<DiamondBlueprint, DiamondContext> {
	private _gameContext: DiamondContext;

	Register(blueprint: DiamondBlueprint, gameState: GameState): void {
		this._gameContext = new DiamondRenderer().Render(blueprint, gameState);
	}
	Publish(): DiamondContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
