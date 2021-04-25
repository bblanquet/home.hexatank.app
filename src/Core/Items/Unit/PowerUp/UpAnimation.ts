import { ZKind } from './../../ZKind';
import { RotationAnimator } from '../../Animator/RotationAnimator';
import { IAnimator } from '../../Animator/IAnimator';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { BouncingScaleUpAnimator } from '../../Animator/BouncingScaleUpAnimator';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../../../Interaction/IInteractionContext';
import { Item } from '../../Item';
import { Vehicle } from '../Vehicle';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { Cell } from '../../Cell/Cell';

export class UpAnimation extends Item {
	private _rotationAnimator: RotationAnimator;
	private _animatorAnimator: IAnimator;
	private _imgIndex: number = 0;
	private _animationTimer: TickTimer;

	constructor(private _vehicle: Vehicle, private _animImages: string[], private _images: string[]) {
		super();
		this.Z = ZKind.AboveCell;
		this._animationTimer = new TickTimer(5);
		this._images.forEach((p) => {
			this.GenerateSprite(p);
		});
		this._rotationAnimator = new RotationAnimator(this, this._images, false);
		this._rotationAnimator.SetStep(0.02);
		//make pivot sprite center
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this._vehicle.GetBoundingBox().Width),
				(sprite.height = this._vehicle.GetBoundingBox().Height);
			sprite.anchor.set(0.5);
			sprite.alpha = 0;
		});
		this.IsCentralRef = true;
		this.InitPosition(this._vehicle.GetBoundingBox());
		this._animatorAnimator = new BouncingScaleUpAnimator(this, this._images, 0.001);

		this._vehicle.OnCellChanged.On(this.CellChanged.bind(this));
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = this._vehicle.GetCurrentCell().IsVisible();
		});
	}

	private CellChanged(source: any, cell: Cell): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cell.IsVisible();
		});
	}

	public GetCurrentRotation(): number {
		return this.GetCurrentSprites().Get(this._images[0]).rotation;
	}
	public SetCurrentRotation(radian: number): void {
		this._rotationAnimator.Init(radian);
	}

	public GetBoundingBox(): BoundingBox {
		return this._vehicle.GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsUpdatable) {
			return;
		}
		super.Update(viewX, viewY);

		if (!isNullOrUndefined(this._animatorAnimator)) {
			this._animatorAnimator.Update(viewX, viewY);
			if (this._animatorAnimator.IsDone) {
				this._animatorAnimator = null;
			}
		}

		if (this._rotationAnimator) {
			this._rotationAnimator.Update(viewX, viewY);
			if (this._animationTimer.IsElapsed()) {
				this.SetProperty(this._animImages[this._imgIndex], (e) => (e.alpha = 0));
				this._imgIndex = (this._imgIndex + 1) % this._animImages.length;
				this.SetProperty(this._animImages[this._imgIndex], (e) => (e.alpha = 1));
			}
		}
	}
}
