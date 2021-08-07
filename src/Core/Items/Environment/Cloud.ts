import { ZKind } from './../ZKind';
import { GameSettings } from '../../Framework/GameSettings';
import { Item } from '../Item';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { ITimer } from '../../../Utils/Timer/ITimer';
import { Point } from '../../../Utils/Geometry/Point';

export class Cloud extends Item {
	private _timer: ITimer;
	public IsFading: boolean;
	private _goingRight: boolean = true;
	private _boundingBox: BoundingBox;

	constructor(private _point: Point, private _max: number, private _sprite: string) {
		super();
		this._timer = new TickTimer(3);
		this.Z = ZKind.Sky;
		this.GenerateSprite(this._sprite);
		this._boundingBox = BoundingBox.New(
			this._point.X,
			this._point.Y,
			GameSettings.Size * 2,
			GameSettings.Size * Math.sqrt(3)
		);
		this.InitPosition(this._point);
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(): void {
		super.Update();

		if (this._goingRight) {
			if (this._boundingBox.GetX() >= this._max) {
				this._goingRight = false;
			} else {
				this._boundingBox.SetX(this._boundingBox.GetX() + 0.05);
			}
		}

		if (!this._goingRight) {
			if (this._boundingBox.GetX() <= this._point.X) {
				this._goingRight = true;
			} else {
				this._boundingBox.SetX(this._boundingBox.GetX() - 0.05);
			}
		}

		if (this._timer.IsElapsed()) {
			if (this.GetSprites()[0].alpha < 0.15) {
				this.IsFading = false;
			}

			if (0.9 < this.GetSprites()[0].alpha) {
				this.IsFading = true;
			}

			if (this.IsFading) {
				this.GetSprites()[0].alpha -= 0.01;
			}

			if (!this.IsFading) {
				this.GetSprites()[0].alpha += 0.01;
			}
		}
	}
}
