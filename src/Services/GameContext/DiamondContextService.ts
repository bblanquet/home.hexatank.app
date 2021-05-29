import { DiamondBlueprint } from './../../Core/Setup/Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Core/Setup/Context/DiamondContext';
import { IGameContextService } from './IGameContextService';
import { DiamondRenderer } from '../../Core/Setup/Render/Diamond/DiamondRenderer';

export class DiamondContextService implements IGameContextService<DiamondBlueprint, DiamondContext> {
	private _gameContext: DiamondContext;

	Register(blueprint: DiamondBlueprint): void {
		this._gameContext = new DiamondRenderer().Render(blueprint);
	}
	Publish(): DiamondContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
