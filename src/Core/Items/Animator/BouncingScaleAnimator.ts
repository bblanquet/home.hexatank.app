import { Item } from '../Item';
import { IAnimator } from './IAnimator';

export class BouncingScaleAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _scale: number = 0;
	private _step: number = 0.01;
	private _isIncreasing: boolean = true;

	public constructor(private _item: Item) {
		this._item.GetSprites().forEach((obj) => {
			obj.width = 0;
			obj.height = 0;
		});
	}
	Reset(): void {}

	Update(viewX: number, viewY: number): void {
		if (this._isIncreasing) {
			this._scale += this._step;
			this.SetBoundingBox(viewX, viewY);
			this._step += 0.005;
		} else {
			this._scale -= this._step;
			this.SetBoundingBox(viewX, viewY);
		}

		if (this._scale > 1.2) {
			this._isIncreasing = false;
		}

		if (this._scale <= 1 && !this._isIncreasing) {
			this._scale = 1;
			this.SetBoundingBox(viewX, viewY);
			this.IsDone = true;
		}
	}

	private SetBoundingBox(viewX: number, viewY: number) {
		this._item.GetSprites().forEach((obj) => {
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
		});
	}
}
