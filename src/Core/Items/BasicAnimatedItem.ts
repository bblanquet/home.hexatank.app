import { IAnimator } from './Animator/IAnimator';
import { BasicItem } from './BasicItem';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
export class BasicAnimatedItem extends BasicItem {
	private _animator: IAnimator;
	constructor(
		boundingBox: BoundingBox,
		sprite: string,
		z: number = 0,
		provider: (e: BasicAnimatedItem) => IAnimator
	) {
		super(boundingBox, sprite, z);
		this._animator = provider(this);
	}

	public Update(viewX: number, viewY: number): void {
		this._animator.Update(viewX, viewY);
		super.Update(viewX, viewY);
	}
}
