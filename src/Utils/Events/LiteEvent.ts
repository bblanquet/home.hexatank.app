import { ErrorHandler } from '../Exceptions/ErrorHandler';
import { ILiteEvent } from './ILiteEvent';

export class LiteEvent<T> implements ILiteEvent<T> {
	private handlers: { (obj: any, data: T): void }[] = [];

	public On(handler: { (obj: any, data: T): void }): void {
		ErrorHandler.ThrowNullOrUndefined(handler);
		this.handlers.push(handler);
	}

	public Off(handler: { (obj: any, data: T): void }): void {
		this.handlers = this.handlers.filter((h) => h !== handler);
	}

	public Clear() {
		this.handlers = [];
	}

	public Invoke(obj: any, data?: T) {
		this.handlers.forEach((h) => h(obj, data));
	}
}
