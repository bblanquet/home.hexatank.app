import { ZKind } from './../ZKind';
import { Item } from '../Item';
import { Tank } from './Tank';
import { Missile } from './Missile';
import { IAngleFinder } from './MotionHelpers/IAngleFinder';
import { AngleFinder } from './MotionHelpers/AngleFinder';
import { IRotatable } from './MotionHelpers/IRotatable';
import { IRotationMaker } from './MotionHelpers/IRotationMaker';
import { RotationMaker } from './MotionHelpers/RotationMaker';
import { ItemSkin } from '../ItemSkin';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { Archive } from '../../Framework/ResourceArchiver';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { GameSettings } from '../../Framework/GameSettings';
import { ITimer } from '../../Utils/Timer/ITimer';

export class Turrel extends Item implements IRotatable {
	CurrentRadius: number;
	GoalRadius: number;
	Base: Tank;
	private _top: string;
	private _currentCanon: number = 0;
	private _rotatingDuration: number;

	private _animationTimer: ITimer;
	private _coolingDownTimer: ITimer;

	IsAnimated: boolean = false;
	IsCanonOverHeat: boolean = false;
	Radius: number;

	private _angleFinder: IAngleFinder;
	private _rotationMaker: IRotationMaker;
	private _skin: ItemSkin;

	constructor(hqSkin: ItemSkin, item: Tank) {
		super();
		this._skin = hqSkin;
		this._rotatingDuration = GameSettings.TurrelRotatingDuration;
		this.CurrentRadius = 0;
		this.Z = ZKind.AboveCell;
		this.Base = item;
		this.Radius = 0;
		this._coolingDownTimer = new TickTimer(100);
		this._animationTimer = new TickTimer(5);

		Archive.cannons.forEach((cannon) => {
			this.GenerateSprite(cannon, (e) => {
				e.alpha = 0;
			});
		});

		this.SetProperty(Archive.cannons[0], (e) => (e.alpha = 1));
		this._top = this._skin.GetTopTankSprite();
		this.GenerateSprite(this._top);

		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.Base.GetBoundingBox().Width), (sprite.height = this.Base.GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
		this._rotationMaker = new RotationMaker<Turrel>(this);
		this._angleFinder = new AngleFinder<Turrel>(this);
	}
	GetRotatingDuration(): number {
		return this._rotatingDuration;
	}
	SetRotatingDuration(rotation: number): void {
		this._rotatingDuration = rotation;
	}

	public GetBoundingBox(): BoundingBox {
		return this.Base.GetBoundingBox();
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this.Action();
	}

	private Action(): void {
		if (!this.Base.HasCamouflage) {
			var isTargetReached = this.Rotating();
		}

		if (this.IsCanonOverHeat) {
			this.CoolingDown();
		} else {
			if (!this.Base.HasCamouflage) {
				if (!this.IsAnimated && isTargetReached) {
					this.Shoot();
				}

				this.CanonAnimation();
			}
		}
	}

	private Shoot() {
		this.IsAnimated = true;
		const missile = new Missile(
			BoundingBox.Create(
				this.GetBoundingBox().X,
				this.GetBoundingBox().Y,
				this.GetBoundingBox().Width,
				this.GetBoundingBox().Height
			),
			this.Base.GetTarget(),
			this.Base.Attack
		);
		missile.GetSprites().forEach((s) => (s.visible = this.Base.GetCurrentCell().IsVisible()));
		this.Base.OnMissileLaunched.Invoke(this, missile);
	}

	private CoolingDown(): void {
		if (this._coolingDownTimer.IsElapsed()) {
			this.IsCanonOverHeat = false;
		}
	}

	private CanonAnimation(): void {
		if (this.IsAnimated) {
			if (this._animationTimer.IsElapsed()) {
				this.SetProperty(Archive.cannons[this._currentCanon], (e) => (e.alpha = 0));
				this._currentCanon = (1 + this._currentCanon) % Archive.cannons.length;
				this.SetProperty(Archive.cannons[this._currentCanon], (e) => (e.alpha = 1));

				if (this._currentCanon == 0) {
					this.IsAnimated = false;
					this.IsCanonOverHeat = true;
				}
			}
		}
	}

	public Rotate(radius: number): void {
		this.GetSprites().forEach((sprite) => {
			sprite.rotation = radius;
			sprite.calculateVertices();
		});
		this.Radius = radius;
	}

	public Select(context: InteractionContext): boolean {
		//nothing to do
		return false;
	}

	private Rotating(): boolean {
		if (this.Base.GetTarget() != null) {
			this._angleFinder.SetAngle(this.Base.GetTarget());

			if (this.CurrentRadius !== this.GoalRadius) {
				this._rotationMaker.Rotate();
				this.Rotate(this.CurrentRadius);
			}

			return this.CurrentRadius === this.GoalRadius;
		}
		return false;
	}
}
