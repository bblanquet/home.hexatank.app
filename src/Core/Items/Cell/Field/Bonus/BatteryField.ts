import { Headquarter } from './../Hq/Headquarter';
import { FadeOutAnimation } from '../../../Animator/FadeOutAnimation';
import { FadeInAnimation } from '../../../Animator/FadeInAnimation';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { ElectronNetwork } from '../Hq/ElectronNetwork';

export class BatteryField extends BonusField {
	private _isUsed: boolean;
	private _ani: IAnimator;
	private _electron: ElectronNetwork;

	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.thunder, Archive.bonus.redThunder ], hq);
		this.SetProperty(Archive.bonus.redThunder, (e) => (e.alpha = 0));
		hq.AddBatteryField(this);
	}

	public IsUsed(): boolean {
		return this._isUsed;
	}

	public SetElectron(e: ElectronNetwork) {
		this._electron = e;
	}

	public SetUsed(isUsed: boolean): void {
		this._isUsed = isUsed;
		if (this._isUsed) {
			this._ani = new FadeInAnimation(this, [ Archive.bonus.redThunder ], 0, 1, 0.005);
		} else {
			this._ani = new FadeOutAnimation(this, [ Archive.bonus.redThunder ], 1, 0, 0.005);
		}
	}

	Support(vehicule: Vehicle): void {}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		if (this._ani && !this._ani.IsDone) {
			this._ani.Update(viewX, viewY);
		}
		if (this._electron) {
			this._electron.Update(viewX, viewY);
		}
	}
}
