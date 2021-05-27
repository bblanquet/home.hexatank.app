import { GameContext } from './../../Core/Framework/GameContext';
import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { IGarbage } from '../IGarbage';
export interface IGameContextService extends IGarbage {
	Register(mapContext: MapContext): void;
	Publish(): GameContext;
}
