import { IGameContext } from '../../Core/Setup/Context/IGameContext';
import { IBlueprint } from './../../Core/Setup/Blueprint/IBlueprint';
import { IGarbage } from '../IGarbage';
export interface IGameContextService<T extends IBlueprint, T1 extends IGameContext> extends IGarbage {
	Register(mapContext: T): void;
	Publish(): T1;
}
