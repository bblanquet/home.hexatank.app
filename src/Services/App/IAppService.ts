import { MapContext } from '../../Core/Setup/Generator/MapContext';

export interface IAppService {
	CreateApp(mapContext: MapContext): boolean;
}
