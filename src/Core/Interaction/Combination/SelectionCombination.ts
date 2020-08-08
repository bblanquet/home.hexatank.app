import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { GameHelper } from '../../Framework/GameHelper';
import { ISelectable } from '../../ISelectable';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CellState } from '../../Items/Cell/CellState';
import { CombinationContext } from './CombinationContext';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ISelectableChecker } from '../ISelectableChecker';
import { GameContext } from '../../Framework/GameContext';
import { AttackField } from '../../Items/Cell/Field/Bonus/AttackField';

export class SelectionCombination extends AbstractSingleCombination {
	private _checker: ISelectableChecker;

	constructor(isSelectable: ISelectableChecker, private _gameContext: GameContext) {
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

			if (selectable instanceof Cell) {
				const selectablecell = selectable as Cell;

				if (
					selectablecell.GetField() instanceof ReactorField &&
					selectablecell.GetState() === CellState.Visible &&
					!(selectablecell.GetField() as ReactorField).IsLocked()
				) {
					const field = selectablecell.GetField() as ReactorField;
					field.SetSelected(true);
					this._gameContext.OnItemSelected.Invoke(this, field);
				} else if (
					selectablecell.GetField() instanceof Headquarter &&
					selectablecell.GetField() === this._gameContext.MainHq
				) {
					const field = selectablecell.GetField() as Headquarter;
					field.SetSelected(true);
					this._gameContext.OnItemSelected.Invoke(this, field);
				} else if (
					selectablecell.GetField() instanceof BasicField &&
					selectablecell.GetState() === CellState.Visible
				) {
					selectable.SetSelected(true);
					this._gameContext.OnItemSelected.Invoke(this, item);
				} else {
					return false;
				}
			} else {
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
