import { Headquarter } from './../Hq/Headquarter';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveBonusField } from './AliveBonusField';
import { AliveItem } from '../../../AliveItem';

export class ShieldField extends AliveBonusField {
	constructor(cell: Cell, private hq: Headquarter) {
		super(cell, [ Archive.bonus.shield ], hq);
	}

	Support(vehicule: Vehicle): void {}

	public IsEnemy(item: AliveItem): boolean {
		return this.hq.IsEnemy(item);
	}
}
