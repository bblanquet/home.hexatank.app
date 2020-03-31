import { AbstractSingleCombination } from './AbstractSingleCombination';
import { Item } from '../../Items/Item';
import { CombinationContext } from './CombinationContext';

export class ClearTrashCombination extends AbstractSingleCombination {
	private _isSelectable: (item: Item) => boolean;

	constructor(isSelectable: (item: Item) => boolean) {
		super();
		this._isSelectable = isSelectable;
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.filter((i) => this._isSelectable(i)).length == 0;
	}

	Combine(items: CombinationContext): boolean {
		if (this.IsMatching(items)) {
			this.OnClearContext.Invoke();
			return true;
		}
		return false;
	}
}
