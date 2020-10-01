import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { IGarbage } from '../IGarbage';

export interface IAppService extends IGarbage {
	Register(mapContext: MapContext): void;
	Publish(): HTMLElement;
	Context(): MapContext;
}
