import { BonusValueProvider } from './BonusValueProvider';
import { SpeedUp } from './../../../Unit/PowerUp/SpeedUp';
import { Headquarter } from '../Hq/Headquarter';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { CellUpCondition } from '../../../Unit/PowerUp/Condition/CellUpCondition';

export class RoadField extends BonusField {
	private _bonusValueProvider: BonusValueProvider = new BonusValueProvider();
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.speed ], hq);
	}
	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		if (vehicule.IsPacific) {
			return;
		}
		const energy = this.GetReactorsPower(this.hq);
		if (0 < energy) {
			const tr = this._bonusValueProvider.GetSpeedTranslation(energy);
			const rt = this._bonusValueProvider.GetSpeedRotation(energy);
			const up = new SpeedUp(vehicule, new CellUpCondition(vehicule), tr, rt);
			vehicule.SetPowerUp(up);
		}
	}
}
