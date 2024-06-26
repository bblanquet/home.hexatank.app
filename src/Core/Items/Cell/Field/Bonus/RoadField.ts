import { UpCalculator } from './UpCalculator';
import { SpeedUp } from './../../../Unit/PowerUp/SpeedUp';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { CellUpCondition } from '../../../Unit/PowerUp/Condition/CellUpCondition';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class RoadField extends BonusField {
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.speed ], hq);
	}
	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		if (vehicule.IsPacific) {
			return;
		}
		const up = new SpeedUp(
			vehicule,
			new CellUpCondition(vehicule),
			this.GetReactorsPower(this.hq),
			this.OnEnergyChanged
		);
		vehicule.AddPowerUp(up);
	}
}
