import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _movableObject: T;
	private _departureDate: number;
	private _arrivalDate: number;
	private _ratio: number = 0;

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
		const target = this._movableObject.GetNextCell().GetBoundingBox();
		const movable = this._movableObject.GetBoundingBox();

		const departureCenter = departure.GetCenter();
		const departureMiddle = departure.GetMiddle();

		const arrivalMiddle = target.GetMiddle();
		const arrivalCenter = target.GetCenter();

		const distanceMiddle = arrivalMiddle - departureMiddle;
		const distanceCenter = arrivalCenter - departureCenter;

		this.Init();

		const currentDate = new Date().getTime() - this._departureDate;
		this._ratio = this.GetPercentage(this._arrivalDate, currentDate);

		movable.X = departure.X + this._ratio * distanceCenter;
		movable.Y = departure.Y + this._ratio * distanceMiddle;

		if (this._ratio === 1) {
			movable.X = this._movableObject.GetNextCell().GetBoundingBox().X;
			movable.Y = this._movableObject.GetNextCell().GetBoundingBox().Y;
			this._departureDate = null;
			this._arrivalDate = null;
			this._movableObject.MoveNextCell();
			this._ratio = 0;
			this._movableObject.OnTranslateStopped.Invoke(this._movableObject, this._movableObject.GetNextCell());
		}
	}

	private Init() {
		if (isNullOrUndefined(this._arrivalDate)) {
			this._ratio = 0;
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
		return Math.round(this._ratio * 100);
	}
	Duration(): number {
		this.Init();
		const duration = this._arrivalDate - this._departureDate;
		return duration - this._ratio * duration;
	}
}
