import { SpeedUp } from './../../../Unit/PowerUp/SpeedUp';
import { Headquarter } from '../Hq/Headquarter';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { CellUpCondition } from '../../../Unit/PowerUp/Condition/CellUpCondition';

export class RoadField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.speed ], hq);
	}
	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		if (!(vehicule.PowerUps instanceof SpeedUp)) {
			const sum = 0.5 + this.GetReactorsPower(this.hq) * 0.1;
			const up = new SpeedUp(vehicule, new CellUpCondition(vehicule), sum, sum);
			vehicule.SetPowerUp(up);
		}
	}
}
