import { Point } from '../Utils/Geometry/Point';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import * as PIXI from 'pixi.js';
import { GameSettings } from '../Framework/GameSettings';

export class InputNotifier {
	private _isDown: boolean = false;
	private _currentPoint: Point;
	private _downPoint: Point;
	private _doubleClickLatency: number = 250;
	public DoubleEvent: LiteEvent<Point>;
	public MovingEvent: LiteEvent<Point>;
	public DownEvent: LiteEvent<Point>;
	public UpEvent: LiteEvent<Point>;
	public MovingUpEvent: LiteEvent<Point>;

	Clear(): void {
		this.DoubleEvent.Clear();
		this.MovingEvent.Clear();
		this.DownEvent.Clear();
		this.DownEvent.Clear();
		this.MovingUpEvent.Clear();
	}

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
		if (this._isDown) {
			this._currentPoint.X = event.data.global.x;
			this._currentPoint.Y = event.data.global.y;
			this.MovingEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
		}
	}

	public HandleMouseDown(event: PIXI.interaction.InteractionEvent): void {
		this._isDown = true;
		const pvsDownDate = this._downDate;
		let pvsDownPoint: Point = null;
		if (this._downPoint) {
			pvsDownPoint = new Point(this._downPoint.X, this._downPoint.Y);
		}
		this._downDate = new Date().getTime();

		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;

		this._downPoint.X = event.data.global.x;
		this._downPoint.Y = event.data.global.y;

		if (this.IsDouble(pvsDownDate)) {
			const dist = Math.abs(this._currentPoint.GetDistance(pvsDownPoint));
			if (dist < 30) {
				this.DoubleEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
			}
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
		this._isDown = false;
		this._currentPoint.X = event.data.global.x;
		this._currentPoint.Y = event.data.global.y;

		const dist = Math.abs(this._currentPoint.GetDistance(this._downPoint));

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
