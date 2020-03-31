import { Tank } from './../../Items/Unit/Tank';
import { AbortMenuItem } from './../../Menu/Buttons/AbortMenuItem';
import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class AbortCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.filter((i) => i instanceof AbortMenuItem).length >= 1 &&
			context.Items.length >= 2
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
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
