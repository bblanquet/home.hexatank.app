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
		this._boundingBox = new BoundingBox();
		this._boundingBox.X = this._point.X;
		this._boundingBox.Y = this._point.Y;
		this._boundingBox.Width = GameSettings.Size * 2;
		this._boundingBox.Height = GameSettings.Size * Math.sqrt(3);
		this.InitPosition(this._point);
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this._goingRight) {
			if (this._boundingBox.X >= this._max) {
				this._goingRight = false;
			} else {
				this._boundingBox.X += 0.05;
			}
		}

		if (!this._goingRight) {
			if (this._boundingBox.X <= this._point.X) {
				this._goingRight = true;
			} else {
				this._boundingBox.X -= 0.05;
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
