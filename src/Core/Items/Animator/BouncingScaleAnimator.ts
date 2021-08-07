import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { Item } from '../Item';
import { IAnimator } from './IAnimator';

export class BouncingScaleAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _scale: number = 0;
	private _step: number = 0.005;
	private _timer: TimeTimer;
	private _isIncreasing: boolean = true;

	public constructor(private _item: Item) {
		this._item.GetSprites().forEach((obj) => {
			obj.width = 0;
			obj.height = 0;
		});
		this._timer = new TimeTimer(10);
	}
	Reset(): void {}

	Update(): void {
		if (this._timer.IsElapsed()) {
			if (this._isIncreasing) {
				this._scale += this._step;
				this.SetBoundingBox();
				this._step += 0.005;
			} else {
				this._scale -= this._step;
				this.SetBoundingBox();
			}

			if (this._scale > 1.2) {
				this._isIncreasing = false;
			}

			if (this._scale <= 1 && !this._isIncreasing) {
				this._scale = 1;
				this.SetBoundingBox();
				this.IsDone = true;
			}
		} else {
			this.SetBoundingBox();
		}
	}

	private SetBoundingBox() {
		this._item.GetSprites().forEach((obj) => {
			obj.width = this._item.GetBoundingBox().GetWidth() * this._scale;
			obj.height = this._item.GetBoundingBox().GetHeight() * this._scale;
			if (!this._item.IsCentralRef) {
				const reference = this._item.GetRef();
				obj.x =
					this._item.GetBoundingBox().GetWidth() / 2 -
					this._item.GetBoundingBox().GetWidth() * this._scale / 2 +
					reference.X;
				obj.y =
					this._item.GetBoundingBox().GetHeight() / 2 -
					this._item.GetBoundingBox().GetHeight() * this._scale / 2 +
					reference.Y;
			}
		});
	}
}
