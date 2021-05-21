import { CellUpCondition } from './../../../Unit/PowerUp/Condition/CellUpCondition';
import { HealUp } from './../../../Unit/PowerUp/HealUp';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { Headquarter } from '../Hq/Headquarter';
import { BonusValueProvider } from './BonusValueProvider';

export class MedicField extends BonusField {
	private _bonusValueProvider: BonusValueProvider = new BonusValueProvider();

	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.health ], hq);
	}

	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		const powerUp = this._bonusValueProvider.GetFixValue(this.GetReactorsPower(this.hq));
		if (0 < powerUp) {
			const up = new HealUp(vehicule, new CellUpCondition(vehicule), powerUp);
			vehicule.SetPowerUp(up);
		}
	}
}
