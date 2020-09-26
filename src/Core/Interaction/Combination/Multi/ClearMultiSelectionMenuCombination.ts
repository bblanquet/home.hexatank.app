import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { MultiCellMenuItem } from '../../../Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../../Menu/Buttons/MultiTankMenuItem';
import { AppHandler } from '../../../App/AppHandler';

export class ClearMultiSelectionMenuCombination extends AbstractSingleCombination {
	private _isShowing: boolean = false;
	constructor(private _appHandler: AppHandler) {
		super();
		this._appHandler.OnMultiMenuShowed.On((src: any, isShowing) => {
			this._isShowing = isShowing;
		});
	}

	IsMatching(context: CombinationContext): boolean {
		return !(
			context.Items.length === 1 &&
			(context.Items[0] instanceof MultiCellMenuItem || context.Items[0] instanceof MultiTankMenuItem) &&
			this._isShowing
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._appHandler.OnMultiMenuShowed.Invoke(this, false);
			return false;
		}
		return false;
	}
}
