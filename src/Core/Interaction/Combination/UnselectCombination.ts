import { ISelectable } from '../../ISelectable';
import { Item } from '../../Items/Item';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CellState } from '../../Items/Cell/CellState';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ISelectableChecker } from '../ISelectableChecker';
import { IGameContext } from '../../Framework/Context/IGameContext';

export class UnselectCombination extends AbstractSingleCombination {
	private _checker: ISelectableChecker;

	constructor(isSelectable: ISelectableChecker, private _gameContext: IGameContext) {
		super();
		this._checker = isSelectable;
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.filter((i) => this._checker.IsSelectable(i)).length >= 2 &&
			(this.SameKind(context, Cell.name) ||
				this.SameKind(context, Vehicle.name) ||
				this.SameKind(context, ReactorField.name))
		);
	}

	private SameKind(context: CombinationContext, type: string): boolean {
		return (
			context.Items.filter((i) => this._checker.IsSelectable(i)).length ===
			context.Items.filter((i) => i.constructor.name === type).length
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const lastItem = context.Items[context.Items.length - 1];
			if (this._checker.IsSelectable(lastItem)) {
				this.UnSelectItem(context.Items[0]);
				this.ClearContext.Invoke();
				this.ForcingSelectedItem.Invoke(this, { item: lastItem, isForced: true });
				if (lastItem === context.Items[0]) {
					this.UnSelectItem(context.Items[0]);
					this.ClearContext.Invoke();
					if (lastItem instanceof Vehicle) {
						const vehicle = lastItem as Vehicle;
						const cell = vehicle.GetCurrentCell();

						if (cell.GetField() instanceof BasicField && cell.GetState() === CellState.Visible) {
							this.ForcingSelectedItem.Invoke(this, { item: cell, isForced: false });
							cell.SetSelected(true);
							this._gameContext.OnItemSelected.Invoke(this, cell);
							return true;
						}
					}
				} else {
					this.UnSelectItem(context.Items[0]);
					this.ClearContext.Invoke();
					this.ForcingSelectedItem.Invoke(this, { item: lastItem, isForced: true });
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
