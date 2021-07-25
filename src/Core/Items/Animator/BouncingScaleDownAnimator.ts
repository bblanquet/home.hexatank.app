import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { Item } from '../Item';
import { IAnimator } from './IAnimator';

export class BouncingScaleDownAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _scale: number = 1;
	private _step: number = 0.08;
	private _isIncreasing: boolean = true;
	private _timer: TimeTimer;
	private _speed: number;

	public constructor(private _item: Item, private _sprites: string[]) {
		this._item.SetProperties(this._sprites, (e) => (e.alpha = 1));
		this._speed = 0.01;
		this._timer = new TimeTimer(20);
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
				this._item.SetProperties(this._sprites, (e) => (e.alpha = 0));
				this.IsDone = true;
			}
		} else {
			this.SetBoundingBox(viewX, viewY);
		}
	}

	private SetBoundingBox(viewX: number, viewY: number) {
		this._item.SetProperties(this._sprites, (obj) => {
			obj.width = this._item.GetBoundingBox().Width * this._scale;
			obj.height = this._item.GetBoundingBox().Height * this._scale;
			if (!this._item.IsCentralRef) {
				const reference = this._item.GetRef();
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
