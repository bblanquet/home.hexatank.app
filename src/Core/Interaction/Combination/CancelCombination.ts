import { ISelectable } from '../../ISelectable';
import { CancelMenuItem } from '../../Menu/Buttons/CancelMenuItem';
import { Item } from '../../Items/Item';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { InteractionMode } from '../InteractionMode';

export class CancelCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return context.Items.filter((i) => i instanceof CancelMenuItem).length >= 1 && context.Items.length >= 2;
	}

	Combine(context: CombinationContext): boolean {
		if (context.Items.filter((i) => i instanceof CancelMenuItem).length >= 1) {
			console.log('');
		}

		if (this.IsMatching(context)) {
			this.UnSelectItem(context.Items[0]);
			this.OnClearContext.Invoke();
			this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
