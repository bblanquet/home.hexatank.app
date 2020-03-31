import { GameHelper } from '../../Framework/GameHelper';
import { TankMenuItem } from '../../Menu/Buttons/TankMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class AddTankCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 1 &&
			context.Items[context.Items.length - 1] instanceof TankMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			GameHelper.PlayerHeadquarter.AddTankRequest();
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
