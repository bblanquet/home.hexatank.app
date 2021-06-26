import { MinusMenuItem } from './../../Menu/Buttons/MinusMenuItem';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class PowerDownCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof ReactorField &&
			context.Items[1] instanceof MinusMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <ReactorField>context.Items[0];
			field.EnergyDown();
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
