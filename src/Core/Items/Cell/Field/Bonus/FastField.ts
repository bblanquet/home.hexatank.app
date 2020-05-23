import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';

export class FastField extends BonusField {
	constructor(cell: Cell, light: string) {
		super(cell, light, [ Archive.bonus.speed ]);
	}
	Support(vehicule: Vehicle): void {
		if (this.IsActive) {
			const sum = this.GetInfluenceSum(vehicule);
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed * (2 + sum);
			vehicule.RotationSpeed = GameSettings.RotationSpeed * (2 + sum);
			vehicule.Attack = GameSettings.Attack;
		}
	}
}
