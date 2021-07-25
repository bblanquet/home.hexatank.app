import { IAnimator } from './IAnimator';
import { Item } from '../Item';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';

export class TransitionAnimation implements IAnimator {
	public IsDone: boolean = false;
	private _current: number;
	private _isDown: boolean;
	private _timer: TimeTimer;

	public constructor(private _item: Item, private _isX: boolean, private _distance: number, private _step: number) {
		this._current = 0;
		this._isDown = _distance < 0;
		this._timer = new TimeTimer(20);
	}
	Reset(): void {
		this._current = 0;
		this.IsDone = false;
	}

	Update(viewX: number, viewY: number): void {
		if (this._timer.IsElapsed()) {
			if (Math.abs(Math.abs(this._distance) - Math.abs(this._current)) < Math.abs(this._step)) {
				this.IsDone = true;
			}
			if (!this.IsDone) {
				this._current = this._isDown ? this._current - this._step : this._current + this._step;

				if (this._isX) {
					let x = this._item.GetBoundingBox().X;
					x = this._isDown ? x - this._step : x + this._step;
					this._item.GetBoundingBox().X = x;
				} else {
					let y = this._item.GetBoundingBox().Y;
					y = this._isDown ? y - this._step : y + this._step;
					this._item.GetBoundingBox().Y = y;
				}
			}
		}
	}
}
