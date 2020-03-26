import { PlusMenuItem } from './../../Menu/Buttons/PlusMenuItem';
import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { PlaygroundHelper } from '../../Framework/PlaygroundHelper';
import { GameSettings } from '../../Framework/GameSettings';

export class PowerUpCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof InfluenceField &&
			context.Items[1] instanceof PlusMenuItem
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
				PlaygroundHelper.PlayerHeadquarter.Buy(
					GameSettings.TruckPrice * PlaygroundHelper.PlayerHeadquarter.GetTotalEnergy()
				)
			) {
				field.PowerUp();
			}
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}

	Clear(): void {}
}
