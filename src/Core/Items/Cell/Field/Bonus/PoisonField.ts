import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { BonusValueProvider } from './BonusValueProvider';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../Hq/Headquarter';

export class PoisonField extends BonusField {
	private poisonTimer: TimeTimer;
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.poison ], hq);
		this.poisonTimer = new TimeTimer(1000);
	}
	Support(vehicule: Vehicle): void {
		if (this.poisonTimer.IsElapsed()) {
			const energy = this.GetReactorsPower(this.hq);
			if (0 < energy) {
				const poison = new BonusValueProvider().GetPoison(energy);
				vehicule.SetDamage(poison);
			}
		}
	}
}
