import { HealMenuItem } from '../../Menu/Buttons/HealMenuItem';
import { AttackMenuItem } from '../../Menu/Buttons/AttackMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { SpeedFieldMenuItem } from '../../Menu/Buttons/SpeedFieldMenuItem';
import { Item } from '../../Items/Item';
import { ISelectable } from '../../ISelectable';

export class OverlockCombination extends AbstractSingleCombination {
	constructor() {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof ReactorField &&
			(context.Items[0] as ReactorField).HasEnergy() &&
			(context.Items[1] instanceof AttackMenuItem ||
				context.Items[1] instanceof HealMenuItem ||
				context.Items[1] instanceof SpeedFieldMenuItem)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const reactor = context.Items[0] as ReactorField;
			reactor.Overclock(context.Items[1]);
			this.UnSelectItem(context.Items[0]);
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
