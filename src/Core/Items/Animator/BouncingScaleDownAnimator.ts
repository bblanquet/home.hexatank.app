import { Item } from '../Item';
import { IAnimator } from './IAnimator';

export class BouncingScaleDownAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _scale: number = 1;
	private _step: number = 0.01;
	private _isIncreasing: boolean = true;

	public constructor(private _item: Item, private _sprite: string) {}

	Update(viewX: number, viewY: number): void {
		this._item.SetProperties([ this._sprite ], (e) => (e.alpha = 1));
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

		if (this._scale <= 0 && !this._isIncreasing) {
			this.IsDone = true;
			this._item.SetProperties([ this._sprite ], (e) => (e.alpha = 0));
		}
	}

	private SetBoundingBox(viewX: number, viewY: number) {
		this._item.SetProperties([ this._sprite ], (obj) => {
			obj.width = this._item.GetBoundingBox().Width * this._scale;
			obj.height = this._item.GetBoundingBox().Height * this._scale;
			obj.alpha = 1;
		});
	}
}
