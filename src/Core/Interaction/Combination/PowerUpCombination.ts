import { PlusMenuItem } from './../../Menu/Buttons/PlusMenuItem';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { GameHelper } from '../../Framework/GameHelper';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class PowerUpCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof InfluenceField &&
			context.Items[1] instanceof PlusMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <InfluenceField>context.Items[0];
			if (
				field.HasStock() ||
				GameHelper.PlayerHeadquarter.Buy(
					GameSettings.TruckPrice * GameHelper.PlayerHeadquarter.GetTotalEnergy()
				)
			) {
				field.PowerUp();
			}
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
