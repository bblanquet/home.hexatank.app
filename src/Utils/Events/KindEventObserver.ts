import { route } from 'preact-router';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { Env } from '../Env';
import { ErrorHandler } from '../Exceptions/ErrorHandler';

export class KindEventObserver<TKind, TMessage> {
	public Handler: (message: TMessage) => void;
	constructor(public Value: TKind, handler: { (message: TMessage): void }) {
		this.Handler = (message: TMessage) => {
			if (Env.IsPrd()) {
				try {
					handler(message);
				} catch (e) {
					ErrorHandler.Log(e);
					ErrorHandler.Send(e);
					Gameworld.Error = e;
					route('{{sub_path}}Error', true);
				}
			} else {
				handler(message);
			}
		};
	}
}
