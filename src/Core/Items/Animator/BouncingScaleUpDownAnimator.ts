import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { Item } from '../Item';
import { IAnimator } from './IAnimator';

export class BouncingScaleUpDownAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _scale: number = 0;
	private _step: number = 0.005;
	private _isIncreasing: boolean = true;
	private _speed: number;
	private _timer: TimeTimer;

	public constructor(private _item: Item, private _sprites: string[]) {
		this._item.SetProperties(this._sprites, (e) => {
			e.alpha = 0;
			e.width = 0;
			e.height = 0;
		});
		this._speed = 0.005;
		this._timer = new TimeTimer(10);
	}
	Reset(): void {}

	Update(viewX: number, viewY: number): void {
		if (this._timer.IsElapsed()) {
			if (this._isIncreasing) {
				this._scale += this._step;
				this.SetBoundingBox(viewX, viewY);
				this._step += this._speed;
			} else {
				this._scale -= this._step;
				this.SetBoundingBox(viewX, viewY);
			}

			if (this._scale > 1.2) {
				this._isIncreasing = false;
			}

			if (this._scale <= 0 && !this._isIncreasing) {
				this._scale = 0;
				this.SetBoundingBox(viewX, viewY);
				this.IsDone = true;
			}
		} else {
			this.SetBoundingBox(viewX, viewY);
		}
	}

	private SetBoundingBox(viewX: number, viewY: number) {
		this._item.SetProperties(this._sprites, (obj) => {
			const reference = this._item.GetRef();
			obj.width = this._item.GetBoundingBox().Width * this._scale;
			obj.height = this._item.GetBoundingBox().Height * this._scale;
			if (!this._item.IsCentralRef) {
				obj.x =
					this._item.GetBoundingBox().Width / 2 -
					this._item.GetBoundingBox().Width * this._scale / 2 +
					(reference.X + viewX);
				obj.y =
					this._item.GetBoundingBox().Height / 2 -
					this._item.GetBoundingBox().Height * this._scale / 2 +
					(reference.Y + viewY);
			}
			obj.alpha = 1;
		});
	}
}
