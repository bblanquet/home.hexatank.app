import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { BonusValueProvider } from './BonusValueProvider';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class PoisonField extends BonusField {
	private poisonTimer: TimeTimer;
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.poison ], hq);
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
