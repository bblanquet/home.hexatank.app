import { InteractionKind } from './../../IInteractionContext';
import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { Item } from '../../../Items/Item';
import { ISelectable } from '../../../ISelectable';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { lazyInject } from '../../../../inversify.config';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { TYPES } from '../../../../types';

export class DisplayMultiMenuCombination extends AbstractSingleCombination {
	@lazyInject(TYPES.Empty) private _interactionService: IInteractionService;
	constructor(private _multiSelectionContext: MultiSelectionContext) {
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
			this._interactionService.OnMultiMenuShowed.Invoke(this, true);

			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
