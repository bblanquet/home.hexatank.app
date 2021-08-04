import { IGameworld } from '../../Framework/World/IGameworld';
import { ISelectable } from '../../ISelectable';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ISelectableChecker } from '../ISelectableChecker';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class SimpleSelectionCombination extends AbstractSingleCombination {
	private _checker: ISelectableChecker;

	constructor(isSelectable: ISelectableChecker, private _gameContext: IGameworld) {
		super();
		this._checker = isSelectable;
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && this._checker.IsSelectable(context.Items[0]);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const item = context.Items[0];
			const selectable = this.ToSelectableItem(item);

			if (selectable instanceof Vehicle) {
				selectable.SetSelected(true);
				this._gameContext.OnItemSelected.Invoke(this, item);
			}
			return true;
		}
		return false;
	}

	private IsSelectableItem(item: any): item is ISelectable {
		return 'SetSelected' in item;
	}

	private ToSelectableItem(item: any): ISelectable {
		if (this.IsSelectableItem(item)) {
			return <ISelectable>item;
		}
		return null;
	}
}
