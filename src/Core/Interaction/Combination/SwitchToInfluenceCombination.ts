import { ICombination } from './ICombination';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { ISelectable } from '../../ISelectable';

export class SwitchToInfluenceCombination implements ICombination {
	constructor() {}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Vehicle ||
				context.Items[0] instanceof Headquarter ||
				context.Items[0] instanceof Cell) &&
			context.Items[1] instanceof InfluenceField
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (context.Items[0] instanceof Vehicle) {
				context.Items.push((context.Items[1] as InfluenceField).GetCell());
				context.Items.splice(1, 1);
				return false;
			} else {
				const selectable = (context.Items[0] as any) as ISelectable;
				selectable.SetSelected(false);
				const cell = context.Items[1] as Cell;
				cell.SetSelected(true);
				context.Items.splice(0, 1);
				return true;
			}
		}
		return false;
	}
	Clear(): void {}
}
