import { CellUpCondition } from './../../../Unit/PowerUp/Condition/CellUpCondition';
import { HealUp } from './../../../Unit/PowerUp/HealUp';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { Headquarter } from '../Hq/Headquarter';

export class MedicField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.health ], hq);
	}

	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		if (!(vehicule.PowerUps instanceof HealUp)) {
			const sum = this.GetReactorsPower(this.hq);
			if (0 < sum) {
				const up = new HealUp(vehicule, new CellUpCondition(vehicule), sum);
				vehicule.SetPowerUp(up);
			}
		}
	}
}
