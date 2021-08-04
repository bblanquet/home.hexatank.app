import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ISelectable } from '../../ISelectable';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { UnitGroup } from '../../Items/UnitGroup';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';

export class SwitchToReactorCombination extends AbstractSingleCombination {
	constructor(private _gameContext: IHqGameworld) {
		super();
	}
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Vehicle ||
				context.Items[0] instanceof Headquarter ||
				context.Items[0] instanceof UnitGroup ||
				context.Items[0] instanceof Cell) &&
			context.Items[1] instanceof ReactorField
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (context.Items[0] instanceof Vehicle) {
				context.Items.push((context.Items[1] as ReactorField).GetCell());
				context.Items.splice(1, 1);
				return false;
			} else {
				const selectable = (context.Items[0] as any) as ISelectable;
				selectable.SetSelected(false);
				const cell = context.Items[1] as Cell;
				cell.SetSelected(true);
				this._gameContext.OnItemSelected.Invoke(this, cell);
				context.Items.splice(0, 1);
				return true;
			}
		}
		return false;
	}
}
