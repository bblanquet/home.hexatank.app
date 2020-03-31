import { TruckMenuItem } from '../../Menu/Buttons/TruckMenuItem';
import { GameHelper } from '../../Framework/GameHelper';
import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class AddTruckCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 1 &&
			context.Items[context.Items.length - 1] instanceof TruckMenuItem
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			GameHelper.PlayerHeadquarter.AddTruckRequest();
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
