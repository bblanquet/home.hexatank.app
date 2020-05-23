import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Archive } from '../../../../Framework/ResourceArchiver';

export class AttackField extends BonusField {
	constructor(cell: Cell, light: string) {
		super(cell, light, [ Archive.bonus.strength ]);
	}

	Support(vehicule: Vehicle): void {
		if (this.IsActive) {
			const sum = this.GetInfluenceSum(vehicule);
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
			vehicule.RotationSpeed = GameSettings.RotationSpeed;
			vehicule.Attack = GameSettings.Attack * (2 + sum);
		}
	}
}
