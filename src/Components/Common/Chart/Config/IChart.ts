export interface IChart<T> {
	GetCanvas(key: string, model: T): HTMLCanvasElement;
}
