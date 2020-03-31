import { Tank } from './../../Items/Unit/Tank';
import { AbortMenuItem } from './../../Menu/Buttons/AbortMenuItem';
import { CombinationContext } from './CombinationContext';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class AbortCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.filter((i) => i instanceof AbortMenuItem).length >= 1 &&
			context.Items.length >= 2
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const vehicle = context.Items[0] as Vehicle;
			vehicle.CancelOrder();
			context.Items.splice(context.Items.length - 1, 1);
			if (vehicle instanceof Tank) {
				(vehicle as Tank).SetMainTarget(null);
			}
			return true;
		}
		return false;
	}
}
