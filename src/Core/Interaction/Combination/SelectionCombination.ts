import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { GameHelper } from '../../Framework/GameHelper';
import { ICombination } from './ICombination';
import { ISelectable } from '../../ISelectable';
import { Item } from '../../Items/Item';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CellState } from '../../Items/Cell/CellState';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';

export class SelectionCombination implements ICombination {
	private _isSelectable: { (item: Item): boolean };

	constructor(isSelectable: { (item: Item): boolean }) {
		this._isSelectable = isSelectable;
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && this._isSelectable(context.Items[0]);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const item = context.Items[0];
			const selectable = this.ToSelectableItem(item);

			if (selectable instanceof Cell) {
				const selectablecell = selectable as Cell;

				if (
					selectablecell.GetField() instanceof InfluenceField &&
					selectablecell.GetState() === CellState.Visible
				) {
					const field = selectablecell.GetField() as InfluenceField;
					field.SetSelected(true);
					GameHelper.SelectedItem.Invoke(this, field);
				} else if (
					selectablecell.GetField() instanceof Headquarter &&
					selectablecell.GetField() === GameHelper.PlayerHeadquarter
				) {
					const field = selectablecell.GetField() as Headquarter;
					field.SetSelected(true);
					GameHelper.SelectedItem.Invoke(this, field);
				} else if (
					selectablecell.GetField() instanceof BasicField &&
					selectablecell.GetState() === CellState.Visible
				) {
					selectable.SetSelected(true);
					GameHelper.SelectedItem.Invoke(this, item);
				} else {
					return false;
				}
			} else {
				selectable.SetSelected(true);
				GameHelper.SelectedItem.Invoke(this, item);
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

	Clear(): void {}
}
