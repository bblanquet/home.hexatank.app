import { InfiniteTransitionAnimator } from './Animator/InfiniteTransitionAnimator';
import { ZKind } from './ZKind';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { Item } from './Item';
import { IInteractionContext } from '../Interaction/IInteractionContext';

export class AboveItem extends Item {
	private static shift: number = 75;
	private _animator: InfiniteTransitionAnimator;
	private _boundingBox: BoundingBox;
	constructor(private _item: Item, private _sprite: string) {
		super();
		this.Z = ZKind.AboveCell;
		this.GenerateSprite(this._sprite);
		this._boundingBox = BoundingBox.Create(
			this._item.GetBoundingBox().X,
			this._item.GetBoundingBox().Y - AboveItem.shift,
			this._item.GetBoundingBox().Width,
			this._item.GetBoundingBox().Height
		);

		this.Init();
		this._animator = new InfiniteTransitionAnimator(this, false, 25, 0.5);
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	Update(vx: number, vy: number): void {
		super.Update(vx, vy);
		this._animator.Update(vx, vy);
	}
}
