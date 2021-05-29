import { CellUpCondition } from './../../../Unit/PowerUp/Condition/CellUpCondition';
import { HealUp } from './../../../Unit/PowerUp/HealUp';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { BonusValueProvider } from './BonusValueProvider';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class MedicField extends BonusField {
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.health ], hq);
	}

	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		const powerUp = new BonusValueProvider().GetFixValue(this.GetReactorsPower(this.hq));
		if (0 < powerUp) {
			const up = new HealUp(vehicule, new CellUpCondition(vehicule), powerUp);
			vehicule.SetPowerUp(up);
		}
	}
}
