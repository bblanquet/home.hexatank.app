import { PowerRenderer } from './../../Core/Framework/Render/PowerRenderer/PowerRenderer';
import { PowerBlueprint } from './../../Core/Framework/Blueprint/Power/PowerBlueprint';
import { PowerContext } from './../../Core/Framework/Context/PowerContext';
import { IGameContextService } from './IGameContextService';

export class PowerContextService implements IGameContextService<PowerBlueprint, PowerContext> {
	private _gameContext: PowerContext;

	Register(mapContext: PowerBlueprint): void {
		this._gameContext = new PowerRenderer().Render(mapContext);
	}
	Publish(): PowerContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
