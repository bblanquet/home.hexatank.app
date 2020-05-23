import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { Headquarter } from '../Hq/Headquarter';

export class NetworkField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.network ], hq);
	}

	Support(vehicule: Vehicle): void {}
}
