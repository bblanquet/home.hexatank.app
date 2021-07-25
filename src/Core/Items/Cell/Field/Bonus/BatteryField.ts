import { IHeadquarter } from './../Hq/IHeadquarter';
import { FadeOutAnimation } from '../../../Animator/FadeOutAnimation';
import { FadeInAnimation } from '../../../Animator/FadeInAnimation';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';

export class BatteryField extends BonusField {
	private _isUsed: boolean;
	private _ani: IAnimator;

	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.thunder, SvgArchive.bonus.redThunder ], hq);
		this.SetProperty(SvgArchive.bonus.redThunder, (e) => (e.alpha = 0));
		hq.AddBatteryField(this);
	}

	public IsUsed(): boolean {
		return this._isUsed;
	}

	public SetUsed(isUsed: boolean): void {
		this._isUsed = isUsed;
		if (this._isUsed) {
			this._ani = new FadeInAnimation(this, [ SvgArchive.bonus.redThunder ], 0, 1, 0.01);
		} else {
			this._ani = new FadeOutAnimation(this, [ SvgArchive.bonus.redThunder ], 1, 0, 0.01);
		}
	}

	Support(vehicule: Vehicle): void {}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		if (this._ani && !this._ani.IsDone) {
			this._ani.Update(viewX, viewY);
		}
	}
}
