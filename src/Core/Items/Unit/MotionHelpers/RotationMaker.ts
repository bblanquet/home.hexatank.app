import { IRotationMaker } from './IRotationMaker';
import { IRotatable } from './IRotatable';
import { isNullOrUndefined } from 'util';

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

	private GetDeg(rad: number): string {
		return ` ${Math.round(rad * 180 / Math.PI)} Deg `;
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
			console.log(
				`%c start Dep${this.GetDeg(this.departureRotation)}Arr${this.GetDeg(
					this.arrivalRotation
				)}Delta${this.GetDeg(this._distance)}${new Date(this._arrivalDate).toLocaleTimeString()}`,
				'color:green'
			);
		}

		const currentDate = new Date().getTime() - this._departureDate;
		const percentage = this.GetPercentage(this._arrivalDate, currentDate);

		if (percentage === 100) {
			this._arrivalDate = null;
			this._movable.CurrentRadius = this.arrivalRotation;
			console.log(`%c end `, 'color:red');
		} else {
			this._movable.CurrentRadius = this.departureRotation + this._distance * percentage * this._sign;
			console.log(
				`%c progress ${this.GetDeg(this._movable.CurrentRadius)}${Math.round(100 * percentage)}% `,
				'color:blue'
			);
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
