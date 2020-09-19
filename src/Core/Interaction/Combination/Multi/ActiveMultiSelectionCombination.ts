import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { CombinationContext } from '../CombinationContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { MultiCellMenuItem } from '../../../Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../../Menu/Buttons/MultiTankMenuItem';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';

export class ActiveMultiSelectionCombination extends AbstractSingleCombination {
	constructor(private _appHandler: AppHandler, private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			!this._multiContext.IsListening() &&
			context.Items.length === 1 &&
			(context.Items[0] instanceof MultiCellMenuItem || context.Items[0] instanceof MultiTankMenuItem)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._appHandler.MultiMenuShowed.Invoke(this, false);
			this._appHandler.PauseNavigation();
			this._multiContext.Listen(context.Items[0] instanceof MultiTankMenuItem);
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}
}
