import { MinusMenuItem } from './../../Menu/Buttons/MinusMenuItem';
import { CombinationContext } from './CombinationContext';
import { Reactor } from '../../Items/Cell/Field/Bonus/Reactor';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class PowerDownCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof Reactor &&
			context.Items[1] instanceof MinusMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <Reactor>context.Items[0];
			field.PowerDown();
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
