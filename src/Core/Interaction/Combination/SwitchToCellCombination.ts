import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ISelectable } from '../../ISelectable';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { UnitGroup } from '../../Items/UnitGroup';

export class SwitchToCellCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Headquarter ||
				context.Items[0] instanceof ReactorField ||
				context.Items[0] instanceof UnitGroup) &&
			context.Items[1] instanceof Cell &&
			(context.Items[1] as Cell).IsVisible()
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
