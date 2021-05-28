import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { Headquarter } from '../Hq/Headquarter';

export class NetworkField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ SvgArchive.bonus.network ], hq);
	}

	Support(vehicule: Vehicle): void {}
}
