import { TimeTimer } from './../../../../../Utils/Timer/TimeTimer';
import { UpCalculator } from './UpCalculator';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { IHeadquarter } from '../Hq/IHeadquarter';
import { PoisonUp } from './../../../Unit/PowerUp/PoisonUp';
import { CellUpCondition } from '../../../Unit/PowerUp/Condition/CellUpCondition';

export class PoisonField extends BonusField {
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.poison ], hq);
	}
	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		const powerUp = new UpCalculator().GetPoison(this.GetReactorsPower(this.hq));
		const up = new PoisonUp(vehicule, new CellUpCondition(vehicule), powerUp, this.OnEnergyChanged);
		vehicule.AddPowerUp(up);
	}
}
