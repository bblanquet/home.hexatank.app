import { ISelectable } from '../../ISelectable';
import { Item } from '../../Items/Item';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';

export class TrackingClearTrashCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			(context.Items.length > 2 || context.Items.filter((e) => e instanceof Vehicle).length >= 2)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
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
