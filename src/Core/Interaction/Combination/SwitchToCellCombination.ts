import { BasicField } from './../../Items/Cell/Field/BasicField';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ISelectable } from '../../ISelectable';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { UnitGroup } from '../../Items/UnitGroup';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';
import { Tank } from '../../Items/Unit/Tank';

export class SwitchToCellCombination extends AbstractSingleCombination {
	constructor(private _gameworld: IHqGameworld) {
		super();
	}
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Headquarter || context.Items[0] instanceof ReactorField) &&
			context.Items[1] instanceof Cell
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const selectable = (context.Items[0] as any) as ISelectable;
			const cell = context.Items[1] as Cell;

			if (cell.IsSelectable()) {
				selectable.SetSelected(false);

				if ((context.Items[1] as Cell).GetField() instanceof BasicField) {
					cell.SetSelected(true);
					this._gameworld.OnItemSelected.Invoke(this, cell);
					context.Items.splice(0, 1);
				} else {
					context.Items.splice(1, 1);
				}
			} else {
				const selectable = (context.Items[0] as any) as ISelectable;
				selectable.SetSelected(false);
				this.ClearContext.Invoke();
			}

			return true;
		}
		return false;
	}
}
