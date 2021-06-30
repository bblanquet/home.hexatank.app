export interface ILiteEvent<T> {
	On(handler: (obj: any, data: T) => void): void;
	Off(handler: (obj: any, data: T) => void): void;
	Invoke(obj: any, data?: T): void;
}
