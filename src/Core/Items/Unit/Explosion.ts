import { Item } from '../Item';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { GameHelper } from '../../Framework/GameHelper';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { ITimer } from '../../Utils/Timer/ITimer';

export class Explosion extends Item {
	BoundingBox: BoundingBox;
	private _currentFrame: number = 0;
	private _currentAlpha: number = 1;
	private _timer: ITimer;
	private _explosions: Array<string>;
	private _isStarted: boolean = true;

	constructor(
		boundingbox: BoundingBox,
		sprites: Array<string>,
		z: number = 3,
		private _effect: boolean = true,
		timer: number = 30
	) {
		super();
		this.Z = z;
		this._timer = new TickTimer(timer);
		this.BoundingBox = new BoundingBox();
		this.BoundingBox.X = boundingbox.X;
		this.BoundingBox.Y = boundingbox.Y;
		this.BoundingBox.Width = boundingbox.Width;
		this.BoundingBox.Height = boundingbox.Height;

		this._explosions = sprites;

		this._explosions.forEach((explosion) => {
			this.GenerateSprite(explosion, (e) => {
				e.anchor.set(0.5);
				e.alpha = 0;
			});
		});
		this.IsCentralRef = true;
		this.InitPosition(boundingbox);
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this._isStarted) {
			this._isStarted = false;
			this.SetProperty(this._explosions[this._currentFrame], (s) => (s.alpha = 1));
		}

		if (0 <= this._currentFrame && this._currentFrame < this._explosions.length && this._effect) {
			this.SetProperty(this._explosions[this._currentFrame], (s) => {
				s.rotation += 0.005;
				s.alpha = this._currentAlpha;
			});
		}

		if (this._effect) {
			this._currentAlpha -= 0.005;
		}

		if (this._currentAlpha < 0) {
			this._currentAlpha = 0;
		}

		if (this._timer.IsElapsed()) {
			var previous = this._currentFrame;
			this._currentFrame += 1;

			if (this._explosions.length == this._currentFrame) {
				this.SetProperty(this._explosions[previous], (s) => (s.alpha = 0));
				this.Destroy();
			} else {
				if (-1 < previous) {
					this.SetProperty(this._explosions[previous], (s) => (s.alpha = 0));
				}
				this.SetProperty(this._explosions[this._currentFrame], (s) => (s.alpha = this._currentAlpha));
			}
		}
	}

	public Destroy() {
		super.Destroy();
		this.IsUpdatable = false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}
}
