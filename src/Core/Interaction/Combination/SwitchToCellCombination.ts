import { ICombination } from './ICombination';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { ISelectable } from '../../ISelectable';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class SwitchToCellCombination implements ICombination {
	constructor() {}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Headquarter || context.Items[0] instanceof InfluenceField) &&
			context.Items[1] instanceof Cell
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const selectable = (context.Items[0] as any) as ISelectable;
			selectable.SetSelected(false);
			const cell = context.Items[1] as Cell;
			cell.SetSelected(true);
			context.Items.splice(0, 1);
			return true;
		}
		return false;
	}
}
