import { MultiSelectionContext } from './../../Menu/Smart/MultiSelectionContext';
import { AppHandler } from './../../../Components/Canvas/AppHandler';
import { MultiOrderMenuItem } from './../../Menu/Buttons/MultiOrderMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';

export class SwithcMultiCombination extends AbstractSingleCombination {
	constructor(private _app: AppHandler, private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.length >= 0 && context.Items[context.Items.length - 1] instanceof MultiOrderMenuItem;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._app.IsOrderMode = !this._app.IsOrderMode;
			if (this._app.IsOrderMode) {
				this._app.PauseNavigation();
				this.OnChangedMode.Invoke(this, InteractionMode.MultipleSelection);
			} else {
				this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
				this._app.RestartNavigation();
				this._multiContext.Close();
			}
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
