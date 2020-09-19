import { UnitGroup } from '../../../Items/UnitGroup';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';

export class MultiUnitOrderCombination extends AbstractSingleCombination {
	constructor(private _appHandler: AppHandler, private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this._multiContext.IsListeningUnit() &&
			context.Items.length === 1 &&
			context.Items[0] instanceof UnitGroup &&
			(context.Items[0] as UnitGroup).IsListeningOrder
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const group = context.Items[0] as UnitGroup;
			if (group.IsListeningOrder) {
				if (0 < this._multiContext.GetCells().length) {
					group.SetOrder(this._multiContext.GetCells());
				}
				this._multiContext.Close();
				this._appHandler.RestartNavigation();
				group.IsListeningOrder = false;
			}
			return true;
		}
		return false;
	}
}
