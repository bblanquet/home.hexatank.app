import { isNullOrUndefined } from 'util';
import { Cell } from '../../Items/Cell/Cell';
import { FlagCell } from '../../Items/Cell/FlagCell';
import { GameHelper } from '../../Framework/GameHelper';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class FlagCellCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && context.Items[0] instanceof Cell;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell) && GameHelper.IsFlagingMode) {
				if (!GameHelper.PlayerHeadquarter.Flagcell) {
					GameHelper.PlayerHeadquarter.Flagcell = new FlagCell(cell);
					GameHelper.Playground.Items.push(GameHelper.PlayerHeadquarter.Flagcell);
				} else {
					GameHelper.PlayerHeadquarter.Flagcell.SetCell(cell);
				}
				GameHelper.IsFlagingMode = false;
			}
		}
		return false;
	}
}
