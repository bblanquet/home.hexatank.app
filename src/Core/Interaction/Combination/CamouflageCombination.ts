import { UnitGroup } from '../../Items/UnitGroup';
import { CamouflageMenuItem } from '../../Menu/Buttons/CamouflageMenutItem';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Tank } from '../../Items/Unit/Tank';

export class CamouflageCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			(context.Items[0] instanceof Vehicle || context.Items[0] instanceof UnitGroup) &&
			context.Items[context.Items.length - 1] instanceof CamouflageMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const tank = context.Items[0] as Tank;
			context.Items.splice(context.Items.length - 1, 1);
			if (tank.HasCamouflage) {
				tank.RemoveCamouflage();
			} else {
				const isCamouflage = tank.SetCamouflage();
				if (isCamouflage) {
					tank.SetSelected(false);
					this.ClearContext.Invoke();
				}
			}

			return false;
		}
		return false;
	}
}
