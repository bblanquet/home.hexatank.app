import { TargetMenuItem } from '../../Menu/Buttons/TargetMenuItem';
import { TargetOrder } from '../../Ia/Order/TargetOrder';
import { Item } from '../../Items/Item';
import { Tank } from '../../Items/Unit/Tank';
import { Cell } from '../../Items/Cell/Cell';
import { ISelectable } from '../../ISelectable';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class TargetCombination extends AbstractSingleCombination {
	IsMatching(combination: CombinationContext): boolean {
		return (
			this.IsNormalMode(combination) &&
			combination.Items.length === 3 &&
			combination.Items[0] instanceof Tank &&
			combination.Items[1] instanceof TargetMenuItem &&
			combination.Items[2] instanceof Cell &&
			(combination.Items[2] as Cell).IsShootable()
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let tank = <Tank>context.Items[0];
			let cell = context.Items[2] as Cell;
			let order = new TargetOrder(tank, cell.GetShootableEntity());
			tank.SetOrder(order);
			this.UnSelectItem(context.Items[0]);
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
