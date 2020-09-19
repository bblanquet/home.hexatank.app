import { AppHandler } from './../../../../Components/Canvas/AppHandler';
import { InteractionKind } from './../../IInteractionContext';
import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { Item } from '../../../Items/Item';
import { ISelectable } from '../../../ISelectable';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';

export class DisplayMultiMenuCombination extends AbstractSingleCombination {
	constructor(private _appHandler: AppHandler, private _multiSelectionContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return context.InteractionKind === InteractionKind.DoubleClick;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._multiSelectionContext.Close();
			if (0 < context.Items.length) {
				this.UnSelectItem(context.Items[0]);
			}
			this.ClearContext.Invoke();
			this._appHandler.OnMultiMenuShowed.Invoke(this, true);

			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
