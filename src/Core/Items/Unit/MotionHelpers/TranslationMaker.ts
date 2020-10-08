import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _item: T;
	private _departureDate: number;
	private _arrivalDate: number;
	private _ratio: number;
	private readonly milliseconds = 1000;

	constructor(item: T) {
		this._item = item;
	}

	private GetPercentage(arrival: number, current: number): number {
		if (arrival <= current) {
			return 1;
		}
		return current / arrival;
	}

	public Translate(): void {
		const departure = this._item.GetCurrentCell().GetBoundingBox();
		const target = this._item.GetNextCell().GetBoundingBox();
		const movable = this._item.GetBoundingBox();

		const departureCenter = departure.GetCenter();
		const departureMiddle = departure.GetMiddle();

		const arrivalMiddle = target.GetMiddle();
		const arrivalCenter = target.GetCenter();

		const distanceMiddle = arrivalMiddle - departureMiddle;
		const distanceCenter = arrivalCenter - departureCenter;

		if (isNullOrUndefined(this._arrivalDate)) {
			this._ratio = 0;
			this._departureDate = new Date().getTime();
			this._arrivalDate =
				new Date(this._departureDate + this._item.GetTranslationDuration() * this.milliseconds).getTime() -
				this._departureDate;
		}

		const currentDate = new Date().getTime() - this._departureDate;
		this._ratio = this.GetPercentage(this._arrivalDate, currentDate);

		movable.X = departure.X + this._ratio * distanceCenter;
		movable.Y = departure.Y + this._ratio * distanceMiddle;

		if (this._ratio === 1) {
			movable.X = this._item.GetNextCell().GetBoundingBox().X;
			movable.Y = this._item.GetNextCell().GetBoundingBox().Y;
			this._departureDate = null;
			this._arrivalDate = null;
			this._item.MoveNextCell();
		}
	}

	Percentage(): number {
		return Math.round(this._ratio * 100);
	}
	Duration(): number {
		const duration = this._arrivalDate - this._departureDate;
		return duration - this._ratio * duration;
	}
}
