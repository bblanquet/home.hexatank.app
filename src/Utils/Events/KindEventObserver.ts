export class KindEventObserver<TKind, TMessage> {
	public Handler: (message: TMessage) => void;
	constructor(public Value: TKind, handler: { (message: TMessage): void }) {
		this.Handler = (message: TMessage) => {
			handler(message);
			//setTimeout(() => handler(message), 200);
		};
	}
}
