import { isNullOrUndefined } from 'util';
import { Up } from './Up';
import { RotationAnimator } from '../../Animator/RotationAnimator';
import { IAnimator } from '../../Animator/IAnimator';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { Archive } from '../../../Framework/ResourceArchiver';
import { BouncingScaleDownAnimator } from '../../Animator/BouncingScaleDownAnimator';
import { BouncingScaleUpAnimator } from '../../Animator/BouncingScaleUpAnimator';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../../../Interaction/IInteractionContext';
import { Vehicle } from '../Vehicle';

export class SpeedUp extends Up {
	private _rotationAnimator: RotationAnimator;
	private _animatorAnimator: IAnimator;
	private _currentSpeedUp: number = 0;
	private _animationTimer: TickTimer;

	constructor(private _vehicle: Vehicle) {
		super();
		this.Z = 3;
		this._animationTimer = new TickTimer(25);
		this._activeTimer = new TimeTimer(20000);
		Archive.speedUp.forEach((p) => {
			this.GenerateSprite(p);
		});
		this._rotationAnimator = new RotationAnimator(this, Archive.speedUp, false);
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
	}
	public GetCurrentRotation(): number {
		return this.GetCurrentSprites().Get(Archive.speedUp[0]).rotation;
	}
	public SetCurrentRotation(radian: number): void {
		this._rotationAnimator.Init(radian);
	}
	public SetActive(isActive: boolean): void {
		this._isActive = isActive;
		if (!isActive) {
			this._animatorAnimator = new BouncingScaleDownAnimator(this, Archive.speedUp);
		} else {
			this._activeTimer = new TimeTimer(20000);
			this._animatorAnimator = new BouncingScaleUpAnimator(this, Archive.speedUp, 0.001);
		}
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

		if (this._isActive) {
			if (this._rotationAnimator) {
				this._rotationAnimator.Update(viewX, viewY);
				if (this._animationTimer.IsElapsed()) {
					this.SetProperty(Archive.speedUp[this._currentSpeedUp], (e) => (e.alpha = 0));
					this._currentSpeedUp = (this._currentSpeedUp + 1) % Archive.speedUp.length;
					this.SetProperty(Archive.speedUp[this._currentSpeedUp], (e) => (e.alpha = 1));
				}
			}
			if (this._activeTimer.IsElapsed()) {
				this.SetActive(false);
			}
		}
	}
}
