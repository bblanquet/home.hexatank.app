export class SimpleEvent {
	private _handlers: { (): void }[] = [];

	public On(handler: { (): void }): void {
		this._handlers.push(handler);
	}

	public Off(handler: { (): void }): void {
		this._handlers = this._handlers.filter((h) => h !== handler);
	}

	public Clear() {
		this._handlers = [];
	}

	public Invoke() {
		this._handlers.forEach((h) => h());
	}
}
