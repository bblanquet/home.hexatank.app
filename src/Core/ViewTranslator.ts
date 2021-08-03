import { ILayerService } from '../Services/Layer/ILayerService';
import { IUpdateService } from '../Services/Update/IUpdateService';
import { Singletons, SingletonKey } from '../Singletons';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { Point } from '../Utils/Geometry/Point';
import { ItemsUpdater } from './ItemsUpdater';

export class ViewTranslator {
	private _updater: ItemsUpdater;
	private _layerService: ILayerService;
	private _currentPoint: Point;
	private _departureDate: number;
	private _arrivalDate: number;
	private _xDistance: number;
	private _yDistance: number;

	constructor(private _b1: BoundingBox, private _b2: BoundingBox, private _milliseconds: number) {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._updater = Singletons.Load<IUpdateService>(SingletonKey.Update).Publish();
		this._currentPoint = this._b1.GetCentralPoint();
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

	public Start(): void {
		this._departureDate = Date.now();
		this._xDistance = this._b2.GetCentralPoint().X - this._b1.GetCentralPoint().X;
		this._yDistance = this._b2.GetCentralPoint().Y - this._b1.GetCentralPoint().Y;
		this._arrivalDate = this._departureDate + this._milliseconds;
		this.Translate();
	}

	private Translate(): void {
		const currentDate = new Date().getTime();
		this.SetView(currentDate);

		if (currentDate < this._arrivalDate) {
			setTimeout(() => {
				this.Translate();
			}, 10);
		}
	}

	private SetView(currentDate: number) {
		const currentDuration = currentDate - this._departureDate;
		const fullDuration = this._arrivalDate - this._departureDate;
		const progress = this.GetPercentage(fullDuration, currentDuration);
		this._currentPoint.X = this._b1.GetCentralPoint().X + progress * this._xDistance;
		this._currentPoint.Y = this._b1.GetCentralPoint().Y + progress * this._yDistance;
		const p = this.GetPosition();
		this._updater.ViewContext.SetX(p.X);
		this._updater.ViewContext.SetY(p.Y);
	}
}
