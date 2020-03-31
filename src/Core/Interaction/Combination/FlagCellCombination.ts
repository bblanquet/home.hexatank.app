import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { Cell } from '../../Items/Cell/Cell';
import { FlagCell } from '../../Items/Cell/FlagCell';
import { GameHelper } from '../../Framework/GameHelper';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class FlagCellCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && context.Items[0] instanceof Cell;
	}
	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
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

	Clear(): void {}
}
