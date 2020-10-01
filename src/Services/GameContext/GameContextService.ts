import { GameContext } from './../../Core/Framework/GameContext';
import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { MapRender } from '../../Core/Setup/Render/MapRender';
import { IGameContextService } from './IGameContextService';

export class GameContextService implements IGameContextService {
	private _gameContext: GameContext;

	Register(mapContext: MapContext): void {
		this._gameContext = new MapRender().Render(mapContext);
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
