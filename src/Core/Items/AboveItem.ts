import { InfiniteTransitionAnimator } from './Animator/InfiniteTransitionAnimator';
import { ZKind } from './ZKind';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Item } from './Item';
import { IInteractionContext } from '../Interaction/IInteractionContext';

export class AboveItem extends Item {
	private static shift: number = 75;
	private _animator: InfiniteTransitionAnimator;
	private _box: BoundingBox;
	private _isVisible: { (): boolean };

	constructor(private _item: Item, private _sprite: string) {
		super();
		this.Z = ZKind.AboveCell;
		this.GenerateSprite(this._sprite);
		this._box = BoundingBox.New(
			this._item.GetBoundingBox().GetX(),
			this._item.GetBoundingBox().GetY() - AboveItem.shift,
			this._item.GetBoundingBox().GetWidth(),
			this._item.GetBoundingBox().GetHeight()
		);

		this.Init();
		this._animator = new InfiniteTransitionAnimator(this, false, 25, 0.5);
		this._isVisible = () => true;
		this._item.GetBoundingBox().OnXChanged.On(this.OnXChanged.bind(this));
		this._item.GetBoundingBox().OnYChanged.On(this.OnYChanged.bind(this));
	}

	private OnXChanged(src: BoundingBox, former: number): void {
		const distance = src.GetX() - former;
		this._box.SetX(this._box.GetX() + distance);
	}

	private OnYChanged(src: BoundingBox, former: number): void {
		const distance = src.GetY() - former;
		this._box.SetY(this._box.GetY() + distance);
	}

	public GetBoundingBox(): BoundingBox {
		return this._box;
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public SetVisible(show: () => boolean): void {
		this._isVisible = show;
	}

	Update(): void {
		if (this._isVisible()) {
			this.SetProperty(this._sprite, (e) => (e.alpha = 1));
			super.Update();
			this._animator.Update();
		} else {
			this.SetProperty(this._sprite, (e) => (e.alpha = 0));
		}
	}
}
