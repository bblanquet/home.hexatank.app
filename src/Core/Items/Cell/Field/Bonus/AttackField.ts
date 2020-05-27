import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Headquarter } from '../Hq/Headquarter';

export class AttackField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.strength ], hq);
	}

	Support(vehicule: Vehicle): void {
		if (0 < this.Energy) {
			const sum = this.GetReactorsPower(this.hq) * 0.1;
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
			vehicule.RotationSpeed = GameSettings.RotationSpeed;
			vehicule.Attack = GameSettings.Attack + 2 + sum;
		}
	}
}
