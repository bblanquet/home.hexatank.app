import { PowerRenderer } from './../../Core/Setup/Render/PowerRenderer/PowerRenderer';
import { PowerBlueprint } from './../../Core/Setup/Blueprint/Power/PowerBlueprint';
import { PowerContext } from './../../Core/Setup/Context/PowerContext';
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
