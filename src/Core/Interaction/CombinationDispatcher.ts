import { ICombinationDispatcher } from './ICombinationDispatcher';
import { ICombination } from './Combination/ICombination';
import { CombinationContext } from './Combination/CombinationContext';

export class CombinationDispatcher implements ICombinationDispatcher {
	private _combinations: Array<ICombination>;

	constructor(combinations: Array<ICombination>) {
		this._combinations = combinations;
	}

	Check(context: CombinationContext): void {
		this._combinations.some((combination) => {
			if (combination.Combine(context)) {
				return true;
			}
			return false;
		});
	}
}
