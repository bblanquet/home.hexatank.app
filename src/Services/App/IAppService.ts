import { RecordContext } from './../../Core/Framework/Record/RecordContext';
import { StatsContext } from './../../Core/Framework/Stats/StatsContext';
import { MapContext } from '../../Core/Setup/Generator/MapContext';
import { IGarbage } from '../IGarbage';

export interface IAppService extends IGarbage {
	Register(mapContext: MapContext): void;
	Publish(): PIXI.Application;
	Context(): MapContext;
	GetStats(): StatsContext;
	GetRecord(): RecordContext;
}
