import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _movableObject: T;
	private _departureDate: number;
	private _arrivalDate: number;
	private _progress: number = 0;

	constructor(item: T) {
		this._movableObject = item;
	}

	private GetPercentage(arrival: number, current: number): number {
		if (arrival <= current) {
			return 1;
		}
		return current / arrival;
	}

	public Translate(): void {
		const departure = this._movableObject.GetCurrentCell().GetBoundingBox();
		const arrival = this._movableObject.GetNextCell().GetBoundingBox();
		const vehicle = this._movableObject.GetBoundingBox();

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
			vehicle.X = this._movableObject.GetNextCell().GetBoundingBox().X;
			vehicle.Y = this._movableObject.GetNextCell().GetBoundingBox().Y;
			this._departureDate = null;
			this._arrivalDate = null;
			this._movableObject.GoNextCell();
			this._progress = 0;
			this._movableObject.OnTranslateStopped.Invoke(this._movableObject, this._movableObject.GetNextCell());
		}
	}

	private Init() {
		if (isNullOrUndefined(this._arrivalDate)) {
			this._progress = 0;
			this._departureDate = new Date().getTime();
			this._arrivalDate =
				new Date(this._departureDate + this._movableObject.GetTranslationDuration()).getTime() -
				this._departureDate;
			this._movableObject.OnTranslateStarted.Invoke(this._movableObject, this._movableObject.GetNextCell());
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
