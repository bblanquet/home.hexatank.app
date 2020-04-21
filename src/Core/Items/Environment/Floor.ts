import { BasicItem } from './../BasicItem';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Archive } from '../../Framework/ResourceArchiver';
import { TickTimer } from '../../Utils/Timer/TickTimer';

export class Floor extends BasicItem {
	private _grassIndex: number;
	private _idleLongTimer: TickTimer;
	private _idleTimer: TickTimer = new TickTimer(4);
	private _isIncreasing: boolean = true;
	private _isAnimated: boolean = true;

	constructor(boundingBox: BoundingBox, sprite: string, z: number = 0) {
		super(boundingBox, sprite, z);
		this._grassIndex = 0;
		Archive.nature.grass.forEach((g) => {
			this.GenerateSprite(g, (e) => {
				e.anchor.set(0.5);
				e.alpha = 0;
			});
		});
		this.InitPosition(boundingBox);
		this.IsCentralRef = true;
		this._idleLongTimer = new TickTimer(this.GetRandom());
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this._idleLongTimer.IsElapsed()) {
			this._idleLongTimer = new TickTimer(this.GetRandom());
			this._idleTimer = new TickTimer(this.GetSmallRandom());
		}

		if (this._idleTimer.IsElapsed()) {
			this.SetProperty(Archive.nature.grass[this._grassIndex], (s) => {
				this.SetProperty(Archive.nature.grass[this._grassIndex], (s) => (s.alpha = 0));
				this.SetNextIndex();
				this.SetProperty(Archive.nature.grass[this._grassIndex], (s) => (s.alpha = 1));
			});
		}
	}

	private GetRandom(): number {
		return Math.floor(Math.random() * (60 - 40) + 40);
	}

	private GetSmallRandom(): number {
		return Math.floor(Math.random() * (8 - 4) + 4);
	}

	private SetNextIndex() {
		let side = 1;
		if (!this._isIncreasing) {
			side *= -1;
		}

		let index = this._grassIndex + side;
		if (index < 0) {
			index = 1;
			this._isIncreasing = true;
		}

		if (Archive.nature.grass.length <= index) {
			index = Archive.nature.grass.length - 2;
			this._isIncreasing = false;
		}

		this._grassIndex = index;
	}
}
