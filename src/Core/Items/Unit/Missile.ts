import { LiteEvent } from './../../../Utils/Events/LiteEvent';
import { ZKind } from './../ZKind';
import { Item } from '../Item';
import { Explosion } from './Explosion';
import { AliveItem } from '../AliveItem';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { GameSettings } from '../../Framework/GameSettings';
import { Point } from '../../../Utils/Geometry/Point';

export class Missile extends Item {
	public BoundingBox: BoundingBox;
	public Target: AliveItem;
	public Index: number;
	public IsReached: Boolean;
	private _speed: number;
	private _currentMissile: number = 0;

	public OnExploded: LiteEvent<Missile> = new LiteEvent<Missile>();

	constructor(boundingbox: BoundingBox, target: AliveItem, private _damage: number) {
		super();
		this.Target = target;
		this.Z = ZKind.Field;
		this.BoundingBox = boundingbox;
		this.IsReached = false;
		var radius = this.GetAngle();

		SvgArchive.missiles.forEach((missile) => {
			this.GenerateSprite(missile);
		});

		this.GetSprites().forEach((sprite) => {
			sprite.width = this.BoundingBox.GetWidth();
			sprite.height = this.BoundingBox.GetHeight();
			sprite.anchor.set(0.5);
			sprite.alpha = 0;
		});

		this.IsCentralRef = true;

		this._speed = GameSettings.MissileTranslationSpeed;

		this.InitPosition(this.BoundingBox.GetPosition());
		this.Rotate(radius);
	}

	public Rotate(radius: number): void {
		this.GetSprites().forEach((sprite) => {
			sprite.rotation = radius;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	private IsTargetReached(): boolean {
		if (
			Math.abs(this.Target.GetBoundingBox().GetCenter() - this.BoundingBox.GetCenter()) < GameSettings.Size / 5 &&
			Math.abs(this.Target.GetBoundingBox().GetMiddle() - this.BoundingBox.GetMiddle()) < GameSettings.Size / 5
		) {
			return true;
		} else {
			return false;
		}
	}

	private GetAngle(): number {
		var aPoint = new Point(this.BoundingBox.GetCenter(), this.BoundingBox.GetMiddle());
		var bPoint = new Point(this.BoundingBox.GetCenter(), this.BoundingBox.GetMiddle() + 1);
		var cPoint = new Point(this.Target.GetBoundingBox().GetCenter(), this.Target.GetBoundingBox().GetMiddle());
		var radius =
			Math.atan2(cPoint.Y - bPoint.Y, cPoint.X - bPoint.X) - Math.atan2(aPoint.Y - bPoint.Y, aPoint.X - bPoint.X);
		return radius;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (!this.IsReached) {
			this.IsReached = this.IsTargetReached();
		}

		if (!this.IsReached) {
			var angle = this.GetAngle();
			var speedX = -this._speed * Math.cos(angle);
			var speedY = this._speed * Math.sin(angle);

			this.GetBoundingBox().SetX(this.GetBoundingBox().GetX() + speedY * 1.5);
			this.GetBoundingBox().SetY(this.GetBoundingBox().GetY() + speedX * 1.5);

			this.SetProperty(SvgArchive.missiles[this._currentMissile], (e) => (e.alpha = 0));
			this._currentMissile = (this._currentMissile + 1) % SvgArchive.missiles.length;
			this.SetProperty(SvgArchive.missiles[this._currentMissile], (e) => (e.alpha = 1));
		} else {
			this.Target.SetDamage(this._damage);
			new Explosion(this.Target.GetBoundingBox(), SvgArchive.explosions, 5, true, 400);

			if (!this.Target.IsAlive()) {
				new Explosion(this.Target.GetBoundingBox(), [ SvgArchive.skull ], 5, true, 400);
			}
			this.OnExploded.Invoke(this, this);
			this.Destroy();
		}
	}

	public Destroy() {
		super.Destroy();
		this.IsUpdatable = false;
	}
}
