import { IRotationMaker } from './IRotationMaker';
import { IRotatable } from './IRotatable';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class RotationMaker<T extends IRotatable> implements IRotationMaker {
	private _movable: T;
	private _departureDate: number;
	private _arrivalDate: number;
	private departureRotation: number;
	private arrivalRotation: number;
	private _distance: number;
	private _sign: number;

	constructor(movable: T) {
		this._movable = movable;
	}

	private GetPercentage(arrival: number, current: number): number {
		if (arrival <= current) {
			return 100;
		}
		return current / arrival;
	}

	public Rotate(): void {
		if (isNullOrUndefined(this._arrivalDate)) {
			this.departureRotation = this._movable.CurrentRadius;
			this.arrivalRotation = this._movable.GoalRadius;

			this._distance = Math.abs(this._movable.CurrentRadius - this._movable.GoalRadius);

			this._departureDate = new Date().getTime();
			const distanceRatio = this._distance / Math.PI * 2;
			const duration = this._departureDate + this._movable.RotatingDuration * distanceRatio * 1000;
			this._arrivalDate = new Date(duration).getTime() - this._departureDate;
			this._sign = this.GetSign() ? 1 : -1;
		}

		const currentDate = new Date().getTime() - this._departureDate;
		const percentage = this.GetPercentage(this._arrivalDate, currentDate);

		if (percentage === 100) {
			this._arrivalDate = null;
			this._movable.CurrentRadius = this.arrivalRotation;
		} else {
			this._movable.CurrentRadius = this.departureRotation + this._distance * percentage * this._sign;
		}
	}

	private GetSign(): boolean {
		if (Math.sign(this.departureRotation) === Math.sign(this.arrivalRotation)) {
			return this.departureRotation < this.arrivalRotation;
		} else {
			const distance = Math.abs(this.departureRotation) + Math.abs(this.arrivalRotation);
			if (distance < Math.PI * 2) {
				return this.departureRotation < this.arrivalRotation;
			} else {
				return this.arrivalRotation < this.departureRotation;
			}
		}
	}
}
