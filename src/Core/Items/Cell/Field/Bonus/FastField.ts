import { Headquarter } from './../Hq/Headquarter';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';

export class FastField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.speed ], hq);
	}
	Support(vehicule: Vehicle): void {
		if (0 < this.Energy) {
			const sum = this.GetReactorsPower(vehicule);
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed * (2 + sum);
			vehicule.RotationSpeed = GameSettings.RotationSpeed * (2 + sum);
			vehicule.Attack = GameSettings.Attack;
		}
	}
}
