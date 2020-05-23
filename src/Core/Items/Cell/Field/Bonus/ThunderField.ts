import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { Headquarter } from '../Hq/Headquarter';

export class ThunderField extends BonusField {
	public IsUsed: boolean;

	constructor(cell: Cell, private hq: Headquarter) {
		super(cell, [ Archive.bonus.thunder ], hq);
	}

	Support(vehicule: Vehicle): void {}
}
