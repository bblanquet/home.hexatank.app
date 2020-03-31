import { TruckMenuItem } from '../../Menu/Buttons/TruckMenuItem';
import { GameHelper } from '../../Framework/GameHelper';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';

export class AddTruckCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 1 &&
			context.Items[context.Items.length - 1] instanceof TruckMenuItem
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
