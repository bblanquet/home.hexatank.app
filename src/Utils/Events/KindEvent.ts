import { KindEventObserver } from './KindEventObserver';

export class KindEvent<TKind, TMessage> {
	private _observers: Array<KindEventObserver<TKind, TMessage>> = new Array<KindEventObserver<TKind, TMessage>>();

	public On(observer: KindEventObserver<TKind, TMessage>): void {
		this._observers.push(observer);
	}

	public Off(observer: KindEventObserver<TKind, TMessage>): void {
		this._observers = this._observers.filter((h) => h !== observer);
	}

	public Clear() {
		this._observers = [];
	}

	public Invoke(value: TKind, message: TMessage): void {
		this._observers.forEach((observer) => {
			if (observer.Value === value) {
				observer.Handler(message);
			}
		});
	}
}
