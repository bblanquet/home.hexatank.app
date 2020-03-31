import { BigMenuItem } from './../../Menu/Buttons/BigMenuItem';
import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { GameHelper } from '../../Framework/GameHelper';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { GameSettings } from '../../Framework/GameSettings';

export class RangeUpCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof InfluenceField &&
			context.Items[1] instanceof BigMenuItem
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
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
				field.RangeUp();
			}
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
