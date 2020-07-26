import { HealUp } from './../../../Unit/PowerUp/HealUp';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { BonusField } from './BonusField';
import { Headquarter } from '../Hq/Headquarter';
import { isNullOrUndefined } from 'util';

export class MedicField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.health ], hq);
	}

	Support(vehicule: Vehicle): void {
		if (0 < this.Energy) {
			const sum = this.GetReactorsPower(this.hq);
			vehicule.SetDamage(-(0.1 + sum * 0.01));
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
			vehicule.RotationSpeed = GameSettings.RotationSpeed;
			vehicule.Attack = GameSettings.Attack;
		}
	}

	public SetPowerUp(vehicule: Vehicle): void {
		if (!(vehicule.PowerUps instanceof HealUp)) {
			const up = new HealUp(vehicule);
			up.SetActive(true);
			up.SetCellPower(true);
			vehicule.SetPowerUp(up);
		}
	}
}
