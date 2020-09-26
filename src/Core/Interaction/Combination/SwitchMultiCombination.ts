import { MultiSelectionContext } from './../../Menu/Smart/MultiSelectionContext';
import { MultiOrderMenuItem } from './../../Menu/Buttons/MultiOrderMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { UnitGroup } from '../../Items/UnitGroup';
import { AppHandler } from '../../App/AppHandler';

export class SwithcMultiCombination extends AbstractSingleCombination {
	constructor(private _app: AppHandler, private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.length >= 0 && context.Items[context.Items.length - 1] instanceof MultiOrderMenuItem;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const group = context.Items[0] as UnitGroup;
			group.IsListeningOrder = !group.IsListeningOrder;
			if (group.IsListeningOrder) {
				this._app.PauseNavigation();
				this._multiContext.Listen(true);
			} else {
				this._app.RestartNavigation();
				this._multiContext.Close();
			}
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
