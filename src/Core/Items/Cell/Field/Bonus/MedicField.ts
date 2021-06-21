import { CellUpCondition } from './../../../Unit/PowerUp/Condition/CellUpCondition';
import { HealUp } from './../../../Unit/PowerUp/HealUp';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { UpCalculator } from './UpCalculator';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class MedicField extends BonusField {
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.health ], hq);
	}

	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		const powerUp = new UpCalculator().GetHeal(this.GetReactorsPower(this.hq));
		const up = new HealUp(vehicule, new CellUpCondition(vehicule), powerUp, this.OnEnergyChanged);
		vehicule.AddPowerUp(up);
	}
}
