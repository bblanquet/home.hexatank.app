import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { IGarbage } from '../IGarbage';
import { GameContext } from './../../Core/Framework/GameContext';
export interface IGameContextService extends IGarbage {
	Register(mapContext: MapContext): void;
	Publish(): GameContext;
}
