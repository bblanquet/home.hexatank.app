import { ISelectableChecker } from './../ISelectableChecker';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';

export class ClearTrashCombination extends AbstractSingleCombination {
	constructor(private _checker: ISelectableChecker) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.filter((i) => this._checker.IsSelectable(i)).length == 0;
	}

	Combine(items: CombinationContext): boolean {
		if (this.IsMatching(items)) {
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}
}
