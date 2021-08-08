import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _vehicle: T;
	private _departureDate: number;
	private _arrivalDuration: number;
	private _progress: number = 0;

	constructor(item: T) {
		this._vehicle = item;
	}

	private GetPercentage(arrival: number, current: number): number {
		if (arrival <= current) {
			return 1;
		}
		return current / arrival;
	}

	public Translate(): void {
		const departure = this._vehicle.GetCurrentCell().GetBoundingBox();
		const arrival = this._vehicle.GetNextCell().GetBoundingBox();
		const vehicle = this._vehicle.GetBoundingBox();

		const departurePoint = departure.GetCentralPoint();
		const arrivalPoint = arrival.GetCentralPoint();

		const yDistance = arrivalPoint.Y - departurePoint.Y;
		const xDistance = arrivalPoint.X - departurePoint.X;

		this.Init();

		const currentDuration = Date.now() - this._departureDate;
		this._progress = this.GetPercentage(this._arrivalDuration, currentDuration);

		vehicle.SetX(departure.GetX() + this._progress * xDistance);
		vehicle.SetY(departure.GetY() + this._progress * yDistance);

		if (this._progress === 1) {
			vehicle.SetX(this._vehicle.GetNextCell().GetBoundingBox().GetX());
			vehicle.SetY(this._vehicle.GetNextCell().GetBoundingBox().GetY());
			this._departureDate = null;
			this._arrivalDuration = null;
			this._vehicle.GoNextCell();
			this._progress = 0;
			this._vehicle.OnTranslateStopped.Invoke(this._vehicle, this._vehicle.GetNextCell());
		}
	}

	Update(): void {
		if (this._departureDate) {
			const now = Date.now();
			const p = this._progress > 1 ? 0 : 1 - this._progress;
			this._arrivalDuration = this._vehicle.GetTranslationDuration() * (1 - this._progress);
		}
	}

	private Init() {
		if (isNullOrUndefined(this._arrivalDuration)) {
			this._progress = 0;
			this._departureDate = new Date().getTime();
			this._arrivalDuration = this._vehicle.GetTranslationDuration();
			this._vehicle.OnTranslateStarted.Invoke(this._vehicle, this._vehicle.GetNextCell());
		}
	}

	Reset(): void {
		this._arrivalDuration = null;
	}

	Percentage(): number {
		this.Init();
		return Math.round(this._progress * 100);
	}
	Duration(): number {
		this.Init();
		const duration = this._arrivalDuration - this._departureDate;
		return duration - this._progress * duration;
	}
}
