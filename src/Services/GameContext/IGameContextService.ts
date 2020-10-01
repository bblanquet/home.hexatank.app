import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { AbstractHqRender } from '../../Core/Setup/Render/Hq/AbstractHqRender';
import { IGarbage } from '../IGarbage';
import { GameContext } from './../../Core/Framework/GameContext';
export interface IGameContextService extends IGarbage {
	Register(hqRender: AbstractHqRender, mapContext: MapContext): void;
	Publish(): GameContext;
}
