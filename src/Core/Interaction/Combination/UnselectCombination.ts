import { GameHelper } from '../../Framework/GameHelper';
import { ISelectable } from '../../ISelectable';
import { Item } from '../../Items/Item';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CellState } from '../../Items/Cell/CellState';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ISelectableChecker } from '../ISelectableChecker';

export class UnselectCombination extends AbstractSingleCombination {
	private _checker: ISelectableChecker;

	constructor(isSelectable: ISelectableChecker) {
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
					context.Items.filter((i) => i instanceof InfluenceField).length)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const lastItem = context.Items[context.Items.length - 1];
			if (this._checker.IsSelectable(lastItem)) {
				if (lastItem === context.Items[0]) {
					this.UnSelectItem(context.Items[0]);
					this.OnClearContext.Invoke();
					if (lastItem instanceof Vehicle) {
						const vehicle = lastItem as Vehicle;
						const cell = vehicle.GetCurrentCell();

						if (cell.GetField() instanceof BasicField && cell.GetState() === CellState.Visible) {
							this.OnPushedItem.Invoke(this, { item: cell, isForced: false });
							cell.SetSelected(true);
							GameHelper.SelectedItem.Invoke(this, cell);
							return true;
						}
					}
				} else {
					this.UnSelectItem(context.Items[0]);
					this.OnClearContext.Invoke();
					this.OnPushedItem.Invoke(this, { item: lastItem, isForced: true });
				}
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