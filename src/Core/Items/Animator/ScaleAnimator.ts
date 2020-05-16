import { Item } from '../Item';
import { IAnimator } from './IAnimator';

export class ScaleAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _scale: number = 0;

	public constructor(private _item: Item) {
		this._item.GetSprites().forEach((obj) => {
			obj.width = 0;
			obj.height = 0;
		});
	}

	Update(viewX: number, viewY: number): void {
		if (this._scale <= 1) {
			this._scale += 0.05;
			const ref = this._item.GetRef();
			this._item.GetSprites().forEach((obj) => {
				obj.width = this._item.GetBoundingBox().Width * this._scale;
				obj.height = this._item.GetBoundingBox().Height * this._scale;
				obj.x =
					this._item.GetBoundingBox().Width / 2 -
					this._item.GetBoundingBox().Width * this._scale / 2 +
					(ref.X + viewX);
				obj.y =
					this._item.GetBoundingBox().Height / 2 -
					this._item.GetBoundingBox().Height * this._scale / 2 +
					(ref.Y + viewY);
			});
		} else {
			this.IsDone = true;
		}
	}
}
