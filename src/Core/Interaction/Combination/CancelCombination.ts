import { ICombination } from './ICombination';
import { IContextContainer } from '../IContextContainer';
import { ISelectable } from '../../ISelectable';
import { CancelMenuItem } from '../../Menu/Buttons/CancelMenuItem';
import { Item } from '../../Items/Item';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class CancelCombination implements ICombination {
	private _interactionContext: IContextContainer;

	constructor(interactionContext: IContextContainer) {
		this._interactionContext = interactionContext;
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.filter((i) => i instanceof CancelMenuItem).length >= 1 &&
			context.Items.length >= 2
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this.UnSelectItem(context.Items[0]);
			this._interactionContext.ClearContext();
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
