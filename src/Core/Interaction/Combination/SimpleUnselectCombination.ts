import { ISelectable } from '../../ISelectable';
import { Item } from '../../Items/Item';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ISelectableChecker } from '../ISelectableChecker';
import { IGameContext } from '../../Setup/Context/IGameContext';

export class SimpleUnselectCombination extends AbstractSingleCombination {
	private _checker: ISelectableChecker;

	constructor(isSelectable: ISelectableChecker, private _gameContext: IGameContext) {
		super();
		this._checker = isSelectable;
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.filter((i) => this._checker.IsSelectable(i)).length >= 2 &&
			(context.Items.filter((i) => this._checker.IsSelectable(i)).length ===
				context.Items.filter((i) => i instanceof Cell).length ||
				context.Items.filter((i) => this._checker.IsSelectable(i)).length ===
					context.Items.filter((i) => i instanceof Vehicle).length ||
				context.Items.filter((i) => this._checker.IsSelectable(i)).length ===
					context.Items.filter((i) => i instanceof ReactorField).length)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const lastItem = context.Items[context.Items.length - 1];
			if (this._checker.IsSelectable(lastItem)) {
				this.UnSelectItem(context.Items[0]);
				this.ClearContext.Invoke();
				this.ForcingSelectedItem.Invoke(this, { item: lastItem, isForced: true });
			}
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
