import { Point } from '../../Utils/Geometry/Point';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import * as PIXI from 'pixi.js';
import { GameSettings } from '../Framework/GameSettings';
import { Viewport } from 'pixi-viewport';

export class InputNotifier {
	private _isDown: boolean = false;
	private _currentPoint: Point;
	private _downPoint: Point;

	private readonly _doubleClickLatency: number = 250;
	private readonly _doubleTapDistance = 30;

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

	constructor(manager: PIXI.InteractionManager, private _viewport: Viewport) {
		this._downPoint = new Point(0, 0);
		this._currentPoint = new Point(0, 0);
		this.UpEvent = new LiteEvent<Point>();
		this.MovingUpEvent = new LiteEvent<Point>();
		this.MovingEvent = new LiteEvent<Point>();
		this.DoubleEvent = new LiteEvent<Point>();
		this.DownEvent = new LiteEvent<Point>();
		(manager as any).on('pointerdown', this.HandleMouseDown.bind(this), false);
		(manager as any).on('pointermove', this.HandleMouseMove.bind(this), false);
		(manager as any).on('pointerup', this.HandleMouseUp.bind(this), false);
		manager.autoPreventDefault = false;
	}

	public HandleMouseMove(event: PIXI.InteractionEvent): void {
		if (this._isDown) {
			this._currentPoint = this.GetRelative(event);
			this.MovingEvent.Invoke(new Point(this._currentPoint.X, this._currentPoint.Y));
		}
	}

	private GetRelative(event: PIXI.InteractionEvent): Point {
		return new Point(
			(event.data.global.x - this._viewport.x) / this._viewport.scale.x,
			(event.data.global.y - this._viewport.y) / this._viewport.scale.x
		);
	}

	public HandleMouseDown(event: PIXI.InteractionEvent): void {
		this._isDown = true;
		const pvsDownDate = this._downDate;
		let pvsDownPoint: Point = null;
		if (this._downPoint) {
			pvsDownPoint = new Point(this._downPoint.X, this._downPoint.Y);
		}
		this._downDate = new Date().getTime();
		this._currentPoint = this.GetRelative(event);
		this._downPoint = new Point(event.data.global.x, event.data.global.y);

		if (this.IsDouble(pvsDownDate)) {
			const dist = Math.abs(this._currentPoint.GetDistance(pvsDownPoint));
			if (dist < this._doubleTapDistance) {
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

	public HandleMouseUp(event: PIXI.InteractionEvent): void {
		this._isDown = false;
		this._currentPoint = this.GetRelative(event);
		const upPoint = new Point(event.data.global.x, event.data.global.y);
		const dist = Math.abs(upPoint.GetDistance(this._downPoint));

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
