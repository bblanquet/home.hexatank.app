import { IGameworld } from '../../Framework/World/IGameworld';
import { ISelectable } from '../../ISelectable';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ISelectableChecker } from '../ISelectableChecker';
import { Tank } from '../../Items/Unit/Tank';

export class SimpleSelectionCombination extends AbstractSingleCombination {
	private _checker: ISelectableChecker;

	constructor(isSelectable: ISelectableChecker, private _gameworld: IGameworld) {
		super();
		this._checker = isSelectable;
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && this._checker.IsSelectable(context.Items[0]);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (context.Items[0] instanceof Tank) {
				const selectable = this.ToSelectableItem(context.Items[0]);
				selectable.SetSelected(true);
				this._gameworld.OnItemSelected.Invoke(this, context.Items[0]);
				return true;
			} else {
				const selectable = this.ToSelectableItem(context.Items[0]);
				selectable.SetSelected(false);
				this.ClearContext.Invoke();
				return true;
			}
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
