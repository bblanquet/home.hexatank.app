import { FadeOutAnimation } from '../../../Animator/FadeOutAnimation';
import { FadeInAnimation } from '../../../Animator/FadeInAnimation';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { Headquarter } from '../Hq/Headquarter';

export class BatteryField extends BonusField {
	private _isUsed: boolean;
	private _ani: IAnimator;

	public IsUsed(): boolean {
		return this._isUsed;
	}

	public SetUsed(isUsed: boolean): void {
		this._isUsed = isUsed;
		if (this._isUsed) {
			this._ani = new FadeInAnimation(this, Archive.bonus.redThunder, 0, 1, 0.005);
		} else {
			this._ani = new FadeOutAnimation(this, Archive.bonus.redThunder, 1, 0, 0.005);
		}
	}

	constructor(cell: Cell, private hq: Headquarter) {
		super(cell, [ Archive.bonus.thunder, Archive.bonus.redThunder ], hq);
		this.SetProperty(Archive.bonus.redThunder, (e) => (e.alpha = 0));
		hq.AddBatteryField(this);
	}

	Support(vehicule: Vehicle): void {}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		if (this._ani && !this._ani.IsDone) {
			this._ani.Update(viewX, viewY);
		}
	}
}
