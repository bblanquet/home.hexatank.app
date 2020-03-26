export class KindEventObserver<TKind, TMessage> {
	constructor(public Value: TKind, public Handler: { (message: TMessage): void }) {}
}
