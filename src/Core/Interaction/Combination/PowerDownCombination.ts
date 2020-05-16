import { MinusMenuItem } from './../../Menu/Buttons/MinusMenuItem';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/Bonus/InfluenceField';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class PowerDownCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof InfluenceField &&
			context.Items[1] instanceof MinusMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <InfluenceField>context.Items[0];
			field.PowerDown();
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
