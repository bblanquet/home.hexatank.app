import { GameContext } from './../../Core/Framework/GameContext';
import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { MapRender } from '../../Core/Setup/Render/MapRender';
import { IGameContextService } from './IGameContextService';
import { AbstractHqRender } from '../../Core/Setup/Render/Hq/AbstractHqRender';

export class GameContextService implements IGameContextService {
	private _gameContext: GameContext;

	Register(hqRender: AbstractHqRender, mapContext: MapContext): void {
		this._gameContext = new MapRender().Render(hqRender, mapContext);
	}
	Publish(): GameContext {
		return this._gameContext;
	}

	Collect(): void {
		if (this._gameContext.Players) {
			this._gameContext.Players.forEach((p) => {
				p.OnChanged.Clear();
			});
		}
		this._gameContext = null;
	}
}
