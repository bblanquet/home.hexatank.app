import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { ITimer } from './../../../../Utils/Timer/ITimer';
import { Headquarter } from './../Hq/Headquarter';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveBonusField } from './AliveBonusField';
import { AliveItem } from '../../../AliveItem';
import { IAnimator } from '../../../Animator/IAnimator';
import { InfiniteFadeAnimation } from '../../../Animator/InfiniteFadeAnimation';

export class ShieldField extends AliveBonusField {
	private _timer: ITimer;
	private _fadeAnimator: IAnimator;

	constructor(cell: Cell, private hq: Headquarter) {
		super(cell, [ Archive.bonus.shieldLight, Archive.bonus.shield ], hq);
		this._timer = new TimeTimer(3000);
		this._fadeAnimator = new InfiniteFadeAnimation(this, Archive.bonus.shieldLight, 0.6, 1, 0.01);
		if (this.Energy === 0) {
			this.SetProperty(Archive.bonus.shield, (e) => (e.alpha = 0));
			this.SetProperty(Archive.bonus.shieldLight, (e) => (e.alpha = 0));
		}
	}

	Support(vehicule: Vehicle): void {}

	public IsEnemy(item: AliveItem): boolean {
		return this.hq.IsEnemy(item);
	}

	public Update(viewX: number, viewY: number): void {
		if (0 < this.Energy) {
			this._fadeAnimator.Update(viewX, viewY);
		}

		if (this._timer.IsElapsed()) {
			if (this.HasDamage()) {
				const bonus = 0.5 * this.GetReactorsPower(this.hq);
				this.SetDamage(-(0.5 + bonus));
			}
		}

		super.Update(viewX, viewY);
	}

	public Destroy() {}
}
