import { IBlueprint } from './../../Core/Setup/Blueprint/IBlueprint';
import { RecordContext } from './../../Core/Framework/Record/RecordContext';
import { StatsContext } from './../../Core/Framework/Stats/StatsContext';
import { IGarbage } from '../IGarbage';

export interface IAppService<T extends IBlueprint> extends IGarbage {
	Register(blueprint: T): void;
	Publish(): PIXI.Application;
	Context(): T;
	GetStats(): StatsContext;
	GetRecord(): RecordContext;
}
