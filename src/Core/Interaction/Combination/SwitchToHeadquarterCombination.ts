import { ICombination } from './ICombination';
import { ISelectable } from '../../ISelectable';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class SwitchToHeadquarterCombination implements ICombination {
	constructor() {}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Vehicle ||
				context.Items[0] instanceof Cell ||
				context.Items[0] instanceof InfluenceField) &&
			context.Items[1] instanceof Headquarter
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const hq = (context.Items[0] as any) as ISelectable;
			hq.SetSelected(false);
			const vehicle = context.Items[1] as Headquarter;
			vehicle.SetSelected(true);
			context.Items.splice(0, 1);
			return true;
		}
		return false;
	}
}
