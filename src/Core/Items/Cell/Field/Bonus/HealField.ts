import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { BonusField } from './BonusField';

export class HealField extends BonusField {
	constructor(cell: Cell, light: string) {
		super(cell, light, [ Archive.bonus.health ]);
	}

	Support(vehicule: Vehicle): void {
		if (this.IsActive) {
			const sum = this.GetInfluenceSum(vehicule);
			vehicule.SetDamage(-(0.1 + sum));
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
			vehicule.RotationSpeed = GameSettings.RotationSpeed;
			vehicule.Attack = GameSettings.Attack;
		}
	}
}
