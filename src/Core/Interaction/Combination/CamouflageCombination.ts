import { UnitGroup } from '../../Items/UnitGroup';
import { ICamouflageAble } from './../../Items/Unit/ICamouflageAble';
import { CamouflageMenuItem } from '../../Menu/Buttons/CamouflageMenutItem';
import { CombinationContext } from './CombinationContext';
import { Tank } from '../../Items/Unit/Tank';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class CamouflageCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			(context.Items[0] instanceof Tank || context.Items[0] instanceof UnitGroup) &&
			context.Items[context.Items.length - 1] instanceof CamouflageMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const tank = (context.Items[0] as unknown) as ICamouflageAble;
			context.Items.splice(context.Items.length - 1, 1);
			if (tank.HasCamouflage) {
				tank.RemoveCamouflage();
			} else {
				return tank.SetCamouflage();
			}
			return false;
		}
		return false;
	}
}
