import { Point } from '../Utils/Geometry/Point';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import * as PIXI from 'pixi.js';
import { GameSettings } from '../Framework/GameSettings';

export class InputNotifier {
	private _currentPoint: Point;
	private _downPoint: Point;
	private _touchDuration = 250;
	private _timerOut: NodeJS.Timeout;

	public HoldingEvent: LiteEvent<Point>;
	public MovingEvent: LiteEvent<Point>;
	public DownEvent: LiteEvent<Point>;
	public UpEvent: LiteEvent<Point>;
	public MovingUpEvent: LiteEvent<Point>;

	constructor() {
		this._downPoint = new Point(0, 0);
		this._currentPoint = new Point(0, 0);
		this.UpEvent = new LiteEvent<Point>();
		this.MovingUpEvent = new LiteEvent<Point>();
		this.MovingEvent = new LiteEvent<Point>();
		this.HoldingEvent = new LiteEvent<Point>();
		this.DownEvent = new LiteEvent<Point>();
	}

	public OnMouseDown(event: PIXI.interaction.InteractionEvent): void {
		console.log(`X ${event.data.global.x} Y ${event.data.global.y}`);

		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;

		this._downPoint.X = event.data.global.x;
		this._downPoint.Y = event.data.global.y;
		this.DownEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));

		if (this._timerOut) {
			clearTimeout(this._timerOut);
		}
		this._timerOut = setTimeout(this.OnLongTouch.bind(this), this._touchDuration);
	}

	private OnLongTouch(): void {
		if (this._timerOut) {
			clearTimeout(this._timerOut);
		}
		const distance = Math.abs(
			Math.sqrt(
				Math.pow(this._currentPoint.X - this._downPoint.X, 2) +
					Math.pow(this._currentPoint.Y - this._downPoint.Y, 2)
			)
		);

		if (distance < GameSettings.Size / 3) {
			this.HoldingEvent.Invoke(this._currentPoint);
		}
	}

	public OnMouseMove(event: PIXI.interaction.InteractionEvent): void {
		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;
		this.MovingEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
	}

	public OnMouseUp(event: PIXI.interaction.InteractionEvent): void {
		if (this._timerOut) {
			clearTimeout(this._timerOut);
		}

		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;

		const dist = Math.abs(
			Math.sqrt(
				Math.pow(this._currentPoint.X - this._downPoint.X, 2) +
					Math.pow(this._currentPoint.Y - this._downPoint.Y, 2)
			)
		);

		if (dist < GameSettings.Size / 6) {
			this.UpEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
		} else {
			this.MovingUpEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
		}
	}
}
