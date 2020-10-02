import { IRotationMaker } from './IRotationMaker';
import { IRotatable } from './IRotatable';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class RotationMaker<T extends IRotatable> implements IRotationMaker {
	private _movable: T;

	private _departureDate: number;
	private departureRotation: number;

	private _duration: number;
	private arrivalRotation: number;

	private _arrivalDate: number = 0;
	private _ratio: number = 0;
	private _angle: number;
	private _fullRotation: number = Math.PI * 2;

	private ToMilliseconds: number = 1000;

	constructor(movable: T) {
		this._movable = movable;
	}

	private Extra() {
		const angleRatio = Math.abs(this._angle / this._fullRotation);
		const milliseconds = this._movable.RotatingDuration * this.ToMilliseconds;
		return milliseconds * angleRatio;
	}

	private GetRatio(arrival: number, current: number): number {
		if (arrival <= current) {
			return 1;
		}
		return current / arrival;
	}

	public Rotate(): void {
		if (isNullOrUndefined(this._duration)) {
			this._ratio = 0;

			this.departureRotation = this._movable.CurrentRadius;
			this.arrivalRotation = this._movable.GoalRadius;

			this._angle = Math.atan2(
				Math.sin(this.arrivalRotation - this.departureRotation),
				Math.cos(this.arrivalRotation - this.departureRotation)
			);

			this._departureDate = new Date().getTime();
			this._arrivalDate = this._departureDate + this.Extra();
			this._duration = new Date(this._arrivalDate).getTime() - this._departureDate;
		}

		const currentDate = new Date().getTime() - this._departureDate;
		this._ratio = this.GetRatio(this._duration, currentDate);
		// console.log(
		// 	`%c ${this._movable.CurrentRadius.toPrecision(2)} ${this.Percentage()} ${moment(this.Duration()).format(
		// 		'ss.SSS'
		// 	)}`,
		// 	'color:red'
		// );

		if (this._ratio === 1) {
			this._duration = null;
			this._movable.CurrentRadius = this.arrivalRotation;
		} else {
			this._movable.CurrentRadius = this.departureRotation + this._angle * this._ratio;
		}
	}

	public Percentage(): number {
		return Math.round(this._ratio * 100);
	}
	public Duration(): number {
		return this._duration - this._duration * this._ratio;
	}
}
