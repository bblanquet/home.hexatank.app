import { ICombination } from './ICombination';
import { IContextContainer } from '../IContextContainer';
import { Item } from '../../Items/Item';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class ClearTrashCombination implements ICombination {
	private _isSelectable: { (item: Item): boolean };
	private _interactionContext: IContextContainer;

	constructor(isSelectable: { (item: Item): boolean }, interactionContext: IContextContainer) {
		this._isSelectable = isSelectable;
		this._interactionContext = interactionContext;
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.filter((i) => this._isSelectable(i)).length == 0;
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(items: CombinationContext): boolean {
		if (this.IsMatching(items)) {
			this._interactionContext.ClearContext();
			return true;
		}
		return false;
	}
}
