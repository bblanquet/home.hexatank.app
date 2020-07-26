import { isNullOrUndefined } from 'util';
import { SpeedUp } from './../../../Unit/PowerUp/SpeedUp';
import { Headquarter } from '../Hq/Headquarter';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';

export class RoadField extends BonusField {
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.speed ], hq);
	}
	Support(vehicule: Vehicle): void {
		if (0 < this.Energy) {
			const sum = this.GetReactorsPower(this.hq) * 0.1;
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed * (1.5 + sum);
			vehicule.RotationSpeed = GameSettings.RotationSpeed * (1.5 + sum);
			vehicule.Attack = GameSettings.Attack;
		}
	}

	public SetPowerUp(vehicule: Vehicle): void {
		if (!(vehicule.PowerUps instanceof SpeedUp)) {
			const up = new SpeedUp(vehicule);
			up.SetActive(true);
			up.SetCellPower(true);
			vehicule.SetPowerUp(up);
		}
	}
}
