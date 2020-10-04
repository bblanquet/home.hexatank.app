import { ZKind } from './../ZKind';
import { Item } from '../Item';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { Archive } from '../../Framework/ResourceArchiver';
import { InteractionContext } from '../../Interaction/InteractionContext';

export class Dust extends Item {
	public BoundingBox: BoundingBox;
	private currentDust: number;
	private currentAlpha: number;
	private _timer: TickTimer;

	constructor(boundingBox: BoundingBox) {
		super();
		this.currentDust = -1;
		this.currentAlpha = 0.5;
		this.Z = ZKind.Field;
		this._timer = new TickTimer(15);

		this.BoundingBox = boundingBox;
		Archive.dusts.forEach((dust) => {
			this.GenerateSprite(dust);
		});
		this.GetSprites().forEach((sp) => {
			sp.alpha = 0;
			sp.anchor.set(0.5);
		});
		this.IsCentralRef = true;
		this.InitPosition(boundingBox);
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public Select(context: InteractionContext): boolean {
		//do nothing
		return false;
	}
	public Update(viewX: number, viewY: number): void {
		if (!this.IsUpdatable) {
			return;
		}

		super.Update(viewX, viewY);

		if (0 <= this.currentDust && this.currentDust < Archive.dusts.length) {
			this.SetProperty(Archive.dusts[this.currentDust], (s) => (s.rotation += 0.1));
			this.SetProperty(Archive.dusts[this.currentDust], (s) => (s.alpha += this.currentAlpha));
		}

		this.currentAlpha -= 0.01;

		if (this.currentAlpha < 0) {
			this.currentAlpha = 0;
		}

		if (!this.IsDone()) {
			if (this._timer.IsElapsed()) {
				var previous = this.currentDust;
				this.currentDust += 1;

				if (Archive.dusts.length == this.currentDust) {
					this.SetProperty(Archive.dusts[previous], (s) => (s.alpha = 0));
				} else {
					if (-1 < previous) {
						this.SetProperty(Archive.dusts[previous], (s) => (s.alpha = 0));
					}
					this.SetProperty(Archive.dusts[this.currentDust], (s) => (s.alpha = this.currentAlpha));
				}
			}
		}
	}

	public Reset(boundingBox: BoundingBox) {
		this.BoundingBox = boundingBox;
		this._timer = new TickTimer(15);
		this.GetSprites().forEach((sp) => {
			sp.alpha = 0;
		});
		this.currentDust = -1;
		this.currentAlpha = 1;
	}

	public IsDone() {
		return Archive.dusts.length == this.currentDust;
	}

	public Destroy() {
		this.IsUpdatable = false;
		super.Destroy();
	}
}
