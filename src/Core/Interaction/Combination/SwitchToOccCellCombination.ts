import { BasicField } from './../../Items/Cell/Field/BasicField';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';
import { Tank } from '../../Items/Unit/Tank';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class SwitchToOccCellCombination extends AbstractSingleCombination {
	constructor(private _gameworld: IHqGameworld) {
		super();
	}
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof Vehicle &&
			context.Items[1] instanceof Vehicle
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const selected = (context.Items[0] as any) as Tank;
			const selectable = context.Items[1] as Tank;
			const cell = selectable.GetCurrentCell();
			const field = cell.GetField();
			if (selected === selectable) {
				if (field instanceof BasicField) {
					cell.SetSelected(true);
					this._gameworld.OnItemSelected.Invoke(this, cell);
					context.Items.splice(0, 2);
					context.Items.push(cell);
				} else if (field instanceof ReactorField) {
					field.SetSelected(true);
					this._gameworld.OnItemSelected.Invoke(this, field);
					context.Items.splice(0, 2);
					context.Items.push(field);
				} else {
					context.Items.splice(1, 1);
				}
			}
			return true;
		}
		return false;
	}
}
