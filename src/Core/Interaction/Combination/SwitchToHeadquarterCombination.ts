import { UnitGroup } from '../../Items/UnitGroup';
import { ISelectable } from '../../ISelectable';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';

export class SwitchToHeadquarterCombination extends AbstractSingleCombination {
	constructor(private _gameContext: IHqGameworld) {
		super();
	}
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Vehicle ||
				context.Items[0] instanceof Cell ||
				context.Items[0] instanceof UnitGroup ||
				context.Items[0] instanceof ReactorField) &&
			context.Items[1] instanceof Headquarter
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const selectable = (context.Items[0] as any) as ISelectable;
			selectable.SetSelected(false);
			const hq = context.Items[1] as Headquarter;
			hq.SetSelected(true);
			this._gameContext.OnItemSelected.Invoke(this, hq);
			context.Items.splice(0, 1);
			return true;
		}
		return false;
	}
}
