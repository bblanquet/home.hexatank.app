import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../Hq/Headquarter';

export class PoisonField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.poison ], hq);
	}
	Support(vehicule: Vehicle): void {
		const coef = this.GetReactorsPower(this.hq) * 0.01;
		vehicule.SetDamage(0.15 + coef);
		vehicule.Attack = GameSettings.Attack;
	}
}
