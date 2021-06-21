import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _vehicle: T;
	private _departureDate: number;
	private _arrivalDate: number;
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

		const currentDate = new Date().getTime() - this._departureDate;
		this._progress = this.GetPercentage(this._arrivalDate, currentDate);

		vehicle.X = departure.X + this._progress * xDistance;
		vehicle.Y = departure.Y + this._progress * yDistance;

		if (this._progress === 1) {
			vehicle.X = this._vehicle.GetNextCell().GetBoundingBox().X;
			vehicle.Y = this._vehicle.GetNextCell().GetBoundingBox().Y;
			this._departureDate = null;
			this._arrivalDate = null;
			this._vehicle.GoNextCell();
			this._progress = 0;
			this._vehicle.OnTranslateStopped.Invoke(this._vehicle, this._vehicle.GetNextCell());
		}
	}

	Update(): void {
		if (this._departureDate) {
			const alreadyDone = this._progress * (this._arrivalDate - this._departureDate);
			const nextDuration = this._vehicle.GetTranslationDuration() - alreadyDone;
			if (nextDuration < 0) {
				this._arrivalDate = new Date(this._departureDate + nextDuration).getTime() - this._departureDate;
			} else {
				this._arrivalDate = new Date(this._departureDate).getTime() - this._departureDate;
			}
		}
	}

	private Init() {
		if (isNullOrUndefined(this._arrivalDate)) {
			this._progress = 0;
			this._departureDate = new Date().getTime();
			this._arrivalDate =
				new Date(this._departureDate + this._vehicle.GetTranslationDuration()).getTime() - this._departureDate;
			this._vehicle.OnTranslateStarted.Invoke(this._vehicle, this._vehicle.GetNextCell());
		}
	}

	Reset(): void {
		this._arrivalDate = null;
	}

	Percentage(): number {
		this.Init();
		return Math.round(this._progress * 100);
	}
	Duration(): number {
		this.Init();
		const duration = this._arrivalDate - this._departureDate;
		return duration - this._progress * duration;
	}
}
