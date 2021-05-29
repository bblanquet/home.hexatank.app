import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { BonusField } from './BonusField';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class NetworkField extends BonusField {
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.network ], hq);
	}

	Support(vehicule: Vehicle): void {}
}
