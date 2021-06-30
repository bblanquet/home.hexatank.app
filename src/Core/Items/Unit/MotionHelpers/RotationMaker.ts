import { IRotationMaker } from './IRotationMaker';
import { IRotatable } from './IRotatable';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';

export class RotationMaker<T extends IRotatable> implements IRotationMaker {
	private _vehicle: T;

	private _departureDate: number;
	private departureRadius: number;

	private _duration: number;
	private arrivalRadius: number;

	private _arrivalDate: number = 0;
	private _progress: number = 0;
	private _deltaRadius: number;

	constructor(movable: T) {
		this._vehicle = movable;
	}

	private Extra() {
		const radius = Math.abs(this._deltaRadius / (Math.PI * 2));
		const milliseconds = this._vehicle.GetRotatingDuration();
		return milliseconds * radius;
	}

	private GetProgress(arrival: number, current: number): number {
		if (arrival <= current) {
			return 1;
		}
		return current / arrival;
	}

	public Rotate(): void {
		this.Init();

		const currentDate = new Date().getTime() - this._departureDate;
		this._progress = this.GetProgress(this._duration, currentDate);

		if (this._progress === 1) {
			this._duration = null;
			this._vehicle.CurrentRadius = this.arrivalRadius;
		} else {
			this._vehicle.CurrentRadius = this.departureRadius + this._deltaRadius * this._progress;
		}
	}

	Update(): void {
		if (this._duration && this._departureDate) {
			this.departureRadius = this._vehicle.CurrentRadius;
			this.arrivalRadius = this._vehicle.GoalRadius;

			this._deltaRadius = Math.atan2(
				Math.sin(this.arrivalRadius - this.departureRadius),
				Math.cos(this.arrivalRadius - this.departureRadius)
			);

			this._arrivalDate = this._departureDate + this.Extra();
			this._duration = new Date(this._arrivalDate).getTime() - this._departureDate;
		}
	}

	private Init() {
		if (isNullOrUndefined(this._duration)) {
			this._progress = 0;

			this.departureRadius = this._vehicle.CurrentRadius;
			this.arrivalRadius = this._vehicle.GoalRadius;

			this._deltaRadius = Math.atan2(
				Math.sin(this.arrivalRadius - this.departureRadius),
				Math.cos(this.arrivalRadius - this.departureRadius)
			);

			this._departureDate = new Date().getTime();
			this._arrivalDate = this._departureDate + this.Extra();
			this._duration = new Date(this._arrivalDate).getTime() - this._departureDate;
		}
	}

	public Percentage(): number {
		return Math.round(this._progress * 100);
	}
	public Duration(): number {
		return this._duration - this._duration * this._progress;
	}
}
