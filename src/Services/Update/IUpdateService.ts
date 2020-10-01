import { IGarbage } from '../IGarbage';
import { ItemsUpdater } from './../../Core/ItemsUpdater';
export interface IUpdateService extends IGarbage {
	Register(): void;
	Publish(): ItemsUpdater;
}
