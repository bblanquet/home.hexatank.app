import { MoneyOrder } from '../../Ia/Order/Composite/MoneyOrder';
import { Truck } from '../../Items/Unit/Truck';
import { SearchMoneyMenuItem } from '../../Menu/Buttons/SearchMoneyMenuItem';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class FarmCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items[0] instanceof Truck &&
			context.Items.filter((i) => i instanceof SearchMoneyMenuItem).length >= 1 &&
			context.Items.length >= 2
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const vehicle = context.Items[0] as Truck;
			vehicle.SetOrder(new MoneyOrder(vehicle));
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
