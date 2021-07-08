import { Hook } from './Hook';
import { NotificationState } from '../Model/NotificationState';
import { LogKind } from '../../Utils/Logger/LogKind';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { StaticLogger } from '../../Utils/Logger/StaticLogger';
import { StateUpdater } from 'preact/hooks';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';

export class NotificationHook extends Hook<NotificationState> {
	private _onNotification: LiteEvent<NotificationState>;
	public OnAnimate: SimpleEvent = new SimpleEvent();
	private _handleNotification: any = this.HandleNotification.bind(this);
	private _timeout: NodeJS.Timeout;

	constructor(d: [NotificationState, StateUpdater<NotificationState>]) {
		super(d[0], d[1]);
	}

	public static DefaultState(): NotificationState {
		return new NotificationState(LogKind.error, '');
	}

	private HandleNotification(src: any, notification: NotificationState): void {
		this.SetProp((e) => {
			e.Kind = notification.Kind;
			e.Message = notification.Message;
		});
		if (0 < notification.Message.length) {
			this.SetProp((e) => {
				e.Kind = notification.Kind;
				e.Message = notification.Message;
			});
			this.OnAnimate.Invoke();

			if (this._timeout) {
				clearTimeout(this._timeout);
			}
			this._timeout = setTimeout(() => {
				this.SetProp((e) => (e.Message = ''));
			}, 3000);
		}
	}

	public On(event: LiteEvent<NotificationState>): void {
		this._onNotification = event;
		this._onNotification.On(this._handleNotification);
	}

	public Unmount(): void {
		this._onNotification.Off(this._handleNotification);
	}

	public GetIcon(): string {
		return StaticLogger.Icons.Get(LogKind[this.State.Kind]);
	}

	public GetColor() {
		return StaticLogger.Colors.Get(LogKind[this.State.Kind]);
	}
}
