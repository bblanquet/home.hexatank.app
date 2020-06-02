import { Tank } from './../../Items/Unit/Tank';
import { AbortMenuItem } from './../../Menu/Buttons/AbortMenuItem';
import { CombinationContext } from './CombinationContext';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ICancellable } from '../../Items/Unit/ICancellable';

export class AbortCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return context.Items.filter((i) => i instanceof AbortMenuItem).length >= 1 && context.Items.length >= 2;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const cancellable = (context.Items[0] as unknown) as ICancellable;
			cancellable.CancelOrder();
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
