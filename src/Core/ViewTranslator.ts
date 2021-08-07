import { Viewport } from 'pixi-viewport';
import { ILayerService } from '../Services/Layer/ILayerService';
import { IUpdateService } from '../Services/Update/IUpdateService';
import { Singletons, SingletonKey } from '../Singletons';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { SimpleEvent } from '../Utils/Events/SimpleEvent';
import { ErrorHandler } from '../Utils/Exceptions/ErrorHandler';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { Point } from '../Utils/Geometry/Point';
import { ItemsUpdater } from './ItemsUpdater';

export class ViewTranslator {
	private _viewport: Viewport;
	private _layerService: ILayerService;
	private _currentPoint: Point;
	private _departureDate: number;
	private _arrivalDate: number;
	private _xDistance: number;
	private _yDistance: number;
	public OnDone: SimpleEvent;
	public OnNext: LiteEvent<number>;
	private _current: number = -1;

	constructor(private _b: BoundingBox[], private _milliseconds: number) {
		ErrorHandler.ThrowNullOrEmpty(this._b);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._viewport = this._layerService.GetViewport();
		this._currentPoint = this._b[0].GetCentralPoint();
		this.OnDone = new SimpleEvent();
		this.OnNext = new LiteEvent<number>();
	}

	private GetPosition(): Point {
		const halfWidthScreen = this._layerService.GetViewport().screenWidth / 2;
		const halfHeightScreen = this._layerService.GetViewport().screenHeight / 2;
		return new Point(-(this._currentPoint.X - halfWidthScreen), -(this._currentPoint.Y - halfHeightScreen));
	}

	private GetPercentage(total: number, current: number): number {
		if (total <= current) {
			return 1;
		}
		return current / total;
	}

	public Next(): void {
		if (this._current < this._b.length - 2) {
			this._current++;
			this._departureDate = Date.now();
			this._xDistance =
				this._b[this._current + 1].GetCentralPoint().X - this._b[this._current].GetCentralPoint().X;
			this._yDistance =
				this._b[this._current + 1].GetCentralPoint().Y - this._b[this._current].GetCentralPoint().Y;
			this._arrivalDate = this._departureDate + this._milliseconds;
			this.Translate();
		}
	}

	private Translate(): void {
		const currentDate = new Date().getTime();
		this.SetView(currentDate);

		if (currentDate < this._arrivalDate) {
			setTimeout(() => {
				this.Translate();
			}, 10);
		} else {
			if (this._b.length - 2 === this._current) {
				this.OnDone.Invoke();
			} else {
				this.OnNext.Invoke(this, this._current);
			}
		}
	}

	private SetView(currentDate: number) {
		const currentDuration = currentDate - this._departureDate;
		const fullDuration = this._arrivalDate - this._departureDate;
		const progress = this.GetPercentage(fullDuration, currentDuration);
		this._currentPoint.X = this._b[this._current].GetCentralPoint().X + progress * this._xDistance;
		this._currentPoint.Y = this._b[this._current].GetCentralPoint().Y + progress * this._yDistance;
		const p = this.GetPosition();
		this._viewport.x = p.X;
		this._viewport.y = p.Y;
	}
}
