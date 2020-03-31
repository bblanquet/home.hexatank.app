import { Truck } from '../../Items/Unit/Truck';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { PersistentOrder } from '../../Ia/Order/PersistentOrder';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class TruckCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Truck &&
			context.Items[1] instanceof Cell
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			var vehicle = <Vehicle>context.Items[0];
			var order = new PersistentOrder(<Cell>context.Items[1], vehicle);
			vehicle.SetOrder(order);
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
