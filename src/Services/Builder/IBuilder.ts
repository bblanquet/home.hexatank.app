import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IGarbage } from '../IGarbage';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
export interface IBuilder<T extends IBlueprint> extends IGarbage {
	Register(blueprint: T, victory: () => void, defeat: () => void): void;
	Reload(): void;
	IsReloadable(): boolean;
	OnReloaded: SimpleEvent;
}
