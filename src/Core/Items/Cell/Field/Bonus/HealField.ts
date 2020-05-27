import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { BonusField } from './BonusField';
import { Headquarter } from '../Hq/Headquarter';

export class HealField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.health ], hq);
	}

	Support(vehicule: Vehicle): void {
		if (0 < this.Energy) {
			const sum = this.GetReactorsPower(vehicule);
			vehicule.SetDamage(-(0.1 + sum));
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
			vehicule.RotationSpeed = GameSettings.RotationSpeed;
			vehicule.Attack = GameSettings.Attack;
		}
	}
}
