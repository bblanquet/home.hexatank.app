import { ZKind } from './../ZKind';
import { BasicItem } from './../BasicItem';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { TickTimer } from '../../../Utils/Timer/TickTimer';

export class Floor extends BasicItem {
	private _grassIndex: number;
	private _idleLongTimer: TickTimer;
	private _idleTimer: TickTimer = new TickTimer(4);
	private _isIncreasing: boolean = true;

	constructor(boundingBox: BoundingBox, sprite: string) {
		super(boundingBox, sprite, ZKind.Ground);
		this._grassIndex = 0;
		SvgArchive.nature.grass.forEach((g) => {
			this.GenerateSprite(g, (e) => {
				e.anchor.set(0.5);
				e.alpha = 0;
			});
		});
		this.InitPosition(boundingBox.GetPosition());
		this.IsCentralRef = true;
		this._idleLongTimer = new TickTimer(this.GetRandom());
	}

	public Update(): void {
		super.Update();

		if (this._idleLongTimer.IsElapsed()) {
			this._idleLongTimer = new TickTimer(this.GetRandom());
			this._idleTimer = new TickTimer(this.GetSmallRandom());
		}

		if (this._idleTimer.IsElapsed()) {
			this.SetProperty(SvgArchive.nature.grass[this._grassIndex], (s) => {
				this.SetProperty(SvgArchive.nature.grass[this._grassIndex], (s) => (s.alpha = 0));
				this.SetNextIndex();
				this.SetProperty(SvgArchive.nature.grass[this._grassIndex], (s) => (s.alpha = 1));
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

		if (SvgArchive.nature.grass.length <= index) {
			index = SvgArchive.nature.grass.length - 2;
			this._isIncreasing = false;
		}

		this._grassIndex = index;
	}
}
