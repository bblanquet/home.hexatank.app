import { AppHandler } from './../../../../Components/Canvas/AppHandler';
import { InteractionKind } from './../../IInteractionContext';
import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { Item } from '../../../Items/Item';
import { ISelectable } from '../../../ISelectable';

export class DisplayMultiMenuCombination extends AbstractSingleCombination {
	constructor(private _appHandler: AppHandler) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return context.InteractionKind === InteractionKind.DoubleClick;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (0 < context.Items.length) {
				this.UnSelectItem(context.Items[0]);
			}
			this.OnClearContext.Invoke();
			this._appHandler.MultiMenuShowed.Invoke(this, true);

			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
