import { CellGroup } from './../../../Items/CellGroup';
import { NetworkMenuItem } from './../../../Menu/Buttons/NetworkMenuItem';
import { ShieldMenuItem } from './../../../Menu/Buttons/ShieldMenuItem';
import { ThunderMenuItem } from './../../../Menu/Buttons/ThunderMenuItem';
import { SlowMenuItem } from '../../../Menu/Buttons/SlowMenuItem';
import { PoisonMenuItem } from '../../../Menu/Buttons/PoisonMenuItem';
import { CombinationContext } from '../CombinationContext';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { AbstractSingleCombination } from '../AbstractSingleCombination';

export class ClearMultiCellBonusCombination extends AbstractSingleCombination {
	constructor() {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.length >= 2 && context.Items[0] instanceof CellGroup && !this.IsCellMenu(context.Items[1]);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const cellGroup = context.Items[0] as CellGroup;
			cellGroup.SetSelected(false);
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}

	private IsCellMenu(menuItem: any): boolean {
		return (
			menuItem instanceof HealMenuItem ||
			menuItem instanceof AttackMenuItem ||
			menuItem instanceof ShieldMenuItem ||
			menuItem instanceof SpeedFieldMenuItem ||
			menuItem instanceof PoisonMenuItem ||
			menuItem instanceof ThunderMenuItem ||
			menuItem instanceof NetworkMenuItem ||
			menuItem instanceof SlowMenuItem
		);
	}
}
