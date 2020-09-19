import { Point } from '../Utils/Geometry/Point';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import * as PIXI from 'pixi.js';
import { GameSettings } from '../Framework/GameSettings';

export class InputNotifier {
	private _currentPoint: Point;
	private _downPoint: Point;
	private _doubleClickLatency: number = 350;
	public DoubleEvent: LiteEvent<Point>;
	public MovingEvent: LiteEvent<Point>;
	public DownEvent: LiteEvent<Point>;
	public UpEvent: LiteEvent<Point>;
	public MovingUpEvent: LiteEvent<Point>;

	private _downDate: number | null;

	constructor() {
		this._downPoint = new Point(0, 0);
		this._currentPoint = new Point(0, 0);
		this.UpEvent = new LiteEvent<Point>();
		this.MovingUpEvent = new LiteEvent<Point>();
		this.MovingEvent = new LiteEvent<Point>();
		this.DoubleEvent = new LiteEvent<Point>();
		this.DownEvent = new LiteEvent<Point>();
	}

	public HandleMouseMove(event: PIXI.interaction.InteractionEvent): void {
		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;
		this.MovingEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
	}

	public HandleMouseDown(event: PIXI.interaction.InteractionEvent): void {
		const pvsDownDate = this._downDate;
		this._downDate = new Date().getTime();

		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;

		this._downPoint.X = event.data.global.x;
		this._downPoint.Y = event.data.global.y;

		if (this.IsDouble(pvsDownDate)) {
			this.DoubleEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
			this._downDate = null;
		} else {
			setTimeout(() => {
				if (this._downDate !== null) {
					this.DownEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
				}
			}, this._doubleClickLatency);
		}
	}

	private IsDouble(pvsDownDate: number) {
		return pvsDownDate && Math.abs(pvsDownDate - this._downDate) < this._doubleClickLatency;
	}

	public HandleMouseUp(event: PIXI.interaction.InteractionEvent): void {
		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;

		const dist = Math.abs(
			Math.sqrt(
				Math.pow(this._currentPoint.X - this._downPoint.X, 2) +
					Math.pow(this._currentPoint.Y - this._downPoint.Y, 2)
			)
		);

		setTimeout(() => {
			if (this._downDate !== null) {
				if (dist < GameSettings.Size / 6) {
					this.UpEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
				} else {
					this.MovingUpEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
				}
			}
		}, this.GetUpDuration());
	}

	private GetUpDuration(): number {
		const now = new Date().getTime();
		const diff = now - this._downDate;
		return diff < this._doubleClickLatency ? this._doubleClickLatency - diff : 0;
	}
}

// private HandleHolding(): void {
// 	if (this._timerOut) {
// 		clearTimeout(this._timerOut);
// 	}
// 	const distance = Math.abs(
// 		Math.sqrt(
// 			Math.pow(this._currentPoint.X - this._downPoint.X, 2) +
// 				Math.pow(this._currentPoint.Y - this._downPoint.Y, 2)
// 		)
// 	);

// 	if (distance < GameSettings.Size / 3) {
// 		this.HoldingEvent.Invoke(this._currentPoint);
// 	}
// }
