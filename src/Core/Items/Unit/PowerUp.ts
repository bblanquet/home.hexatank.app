// import { isNullOrUndefined } from 'util';
// import { Tank } from './Tank';
// import { RotationAnimator } from './../Animator/RotationAnimator';
// import { BoundingBox } from './../../Utils/Geometry/BoundingBox';
// import { IAnimator } from './../Animator/IAnimator';
// import { TickTimer } from './../../Utils/Timer/TickTimer';
// import { Item } from './../../Items/Item';
// import { IInteractionContext } from '../../Interaction/IInteractionContext';
// import { Archive } from '../../Framework/ResourceArchiver';
// import { BouncingScaleUpAnimator } from '../Animator/BouncingScaleUpAnimator';
// import { BouncingScaleDownAnimator } from '../Animator/BouncingScaleDownAnimator';
// import { TimeTimer } from '../../Utils/Timer/TimeTimer';

// export class PowerUp extends Item {
// 	private _rotationAnimator: RotationAnimator;
// 	private _animatorAnimator: IAnimator;
// 	private _currentPowerup: number = 0;
// 	private _animationTimer: TickTimer;
// 	private _activeTimer: TimeTimer;
// 	private _isActive: boolean;

// 	constructor(private _tank: Tank) {
// 		super();
// 		this.Z = 3;
// 		this._isActive = false;
// 		this._animationTimer = new TickTimer(5);
// 		this._activeTimer = new TimeTimer(20000);
// 		Archive.powerUpR.forEach((p) => {
// 			this.GenerateSprite(p);
// 		});
// 		this._rotationAnimator = new RotationAnimator(this, Archive.powerUpR, false);
// 		this._rotationAnimator.SetStep(0.02);
// 		//make pivot sprite center
// 		this.GetSprites().forEach((sprite) => {
// 			(sprite.width = this._tank.GetBoundingBox().Width), (sprite.height = this._tank.GetBoundingBox().Height);
// 			sprite.anchor.set(0.5);
// 			sprite.alpha = 0;
// 		});
// 		this.IsCentralRef = true;
// 		this.InitPosition(this._tank.GetBoundingBox());
// 	}

// 	public IsActive(): boolean {
// 		return this._isActive;
// 	}

// 	public SetActive(isActive: boolean): void {
// 		this._isActive = isActive;
// 		if (!isActive) {
// 			this._animatorAnimator = new BouncingScaleDownAnimator(this, Archive.powerUpR);
// 		} else {
// 			this._activeTimer = new TimeTimer(20000);
// 			this._animatorAnimator = new BouncingScaleUpAnimator(this, Archive.powerUpR, 0.001);
// 		}
// 	}

// 	public GetBoundingBox(): BoundingBox {
// 		return this._tank.GetBoundingBox();
// 	}
// 	public Select(context: IInteractionContext): boolean {
// 		return false;
// 	}

// 	public Update(viewX: number, viewY: number): void {
// 		super.Update(viewX, viewY);

// 		if (!isNullOrUndefined(this._animatorAnimator)) {
// 			this._animatorAnimator.Update(viewX, viewY);
// 			if (this._animatorAnimator.IsDone) {
// 				this._animatorAnimator = null;
// 			}
// 		}

// 		if (this._isActive) {
// 			if (this._rotationAnimator) {
// 				this._rotationAnimator.Update(viewX, viewY);
// 				if (this._animationTimer.IsElapsed()) {
// 					this.SetProperty(Archive.powerUp[this._currentPowerup], (e) => (e.alpha = 0));
// 					this._currentPowerup = (this._currentPowerup + 1) % Archive.powerUp.length;
// 					this.SetProperty(Archive.powerUp[this._currentPowerup], (e) => (e.alpha = 1));
// 				}
// 			}
// 			if (this._activeTimer.IsElapsed()) {
// 				this.SetActive(false);
// 			}
// 		}
// 	}
// }
