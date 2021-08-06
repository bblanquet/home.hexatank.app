import { PlusMenuItem } from './../../Menu/Buttons/PlusMenuItem';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ElecMenuItem } from '../../Menu/Buttons/ElecMenuItem';

export class PowerCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof ReactorField &&
			context.Items[1] instanceof ElecMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = context.Items[0] as ReactorField;
			field.ChangeEnergy();
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
