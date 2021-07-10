import { IBlueprint } from './../../Core/Framework/Blueprint/IBlueprint';
import { RecordContext } from './../../Core/Framework/Record/RecordContext';
import { StatsContext } from './../../Core/Framework/Stats/StatsContext';
import { IGarbage } from '../IGarbage';
import { Application } from 'pixi.js';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';

export interface IAppService<T extends IBlueprint> extends IGarbage {
	Register(blueprint: T, victory: () => void, defeat: () => void): void;
	Publish(): Application;
	Context(): T;
	GetStats(): StatsContext;
	GetRecord(): RecordContext;
	Retry(): void;
	OnRetried: SimpleEvent;
	IsRetriable(): boolean;
}
