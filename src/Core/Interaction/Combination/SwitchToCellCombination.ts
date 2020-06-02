import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { Reactor } from '../../Items/Cell/Field/Bonus/Reactor';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ISelectable } from '../../ISelectable';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { Group } from '../../Items/Group';

export class SwitchToCellCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Headquarter ||
				context.Items[0] instanceof Reactor ||
				context.Items[0] instanceof Group) &&
			context.Items[1] instanceof Cell
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const selectable = (context.Items[0] as any) as ISelectable;
			selectable.SetSelected(false);
			const cell = context.Items[1] as Cell;
			cell.SetSelected(true);
			context.Items.splice(0, 1);
			return true;
		}
		return false;
	}
}
