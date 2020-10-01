import { injectable } from 'inversify';
import { GameContext } from './../../Core/Framework/GameContext';
import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { HqRender } from '../../Core/Setup/Render/Hq/HqRender';
import { MapRender } from '../../Core/Setup/Render/MapRender';
import { IGameContextService } from './IGameContextService';

@injectable()
export class GameContextService implements IGameContextService {
	private _gameContext: GameContext;

	Register(mapContext: MapContext): void {
		const hqRender = new HqRender();
		this._gameContext = new MapRender(hqRender).Render(mapContext);
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
