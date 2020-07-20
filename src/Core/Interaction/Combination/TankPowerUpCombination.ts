import { AttackField } from './../../Items/Cell/Field/Bonus/AttackField';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { ActiveMenuItem } from '../../Menu/Buttons/ActiveMenuItem';
import { Tank } from '../../Items/Unit/Tank';
import { Cell } from '../../Items/Cell/Cell';

export class TankPowerUpCombination extends AbstractSingleCombination {
	constructor() {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof AttackField &&
			context.Items[1] instanceof ActiveMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const attackeField = context.Items[0] as AttackField;
			const hq = attackeField.GetHq();
			const reactors = attackeField.GetHq().GetReactors().filter((e) => e.IsCovered(attackeField.GetCell()));
			if (0 < reactors.length) {
				const cells = reactors.reduce((a, b) => a.concat(b.GetAllCells()), new Array<Cell>());
				cells.filter((c) => c.HasOccupier()).forEach((c) => {
					const occ = c.GetOccupier();
					if (occ instanceof Tank && (occ as Tank).Hq === hq) {
						occ.PowerUp.SetActive(true);
					}
				});
			}
			return true;
		}
		return false;
	}
}
