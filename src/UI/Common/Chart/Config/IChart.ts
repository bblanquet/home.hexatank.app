import { LiteEvent } from '../../../../Utils/Events/LiteEvent';

export interface IChart<T> {
	GetCanvas(key: string, model: T): HTMLCanvasElement;
	OnClickElement: LiteEvent<string>;
}
