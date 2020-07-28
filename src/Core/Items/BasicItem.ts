import { IAnimator } from './Animator/IAnimator';
import { InteractionContext } from './../Interaction/InteractionContext';
import { Item } from './Item';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';

export class BasicItem extends Item {
	private _isVisible: { (): boolean };
	private _isAlive: { (): boolean };
	private _spriteName: string;
	private _animator: IAnimator = null;
	constructor(private _boundingBox: BoundingBox, sprite: string, z: number = 0) {
		super();
		this.Z = z;
		this._spriteName = sprite;
		this.GenerateSprite(sprite, (e) => {
			e.anchor.set(0.5);
			e.alpha = 0;
		});
		this.InitPosition(this._boundingBox);
		this.IsCentralRef = true;
	}

	public SetAnimator(animator: IAnimator): void {
		this._animator = animator;
	}

	public SetRotation(radius: number): void {
		this.SetProperty(this._spriteName, (e) => (e.rotation = radius));
	}

	public SetVisible(show: () => boolean): void {
		this._isVisible = show;
	}

	public SetAlive(show: () => boolean): void {
		this._isAlive = show;
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		if (this._animator && !this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		} else {
			const visible = this._isVisible();
			this.SetProperty(this._spriteName, (e) => (e.alpha = visible ? 1 : 0));
		}

		if (!this._isAlive()) {
			this.Destroy();
		}
	}

	public Destroy(): void {
		super.Destroy();
		this.IsUpdatable = false;
	}
}
