import { SmallMenuItem } from './../../Menu/Buttons/SmallMenuItem';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/Bonus/InfluenceField';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class RangeDownCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof InfluenceField &&
			context.Items[1] instanceof SmallMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <InfluenceField>context.Items[0];
			field.RangeDown();
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
