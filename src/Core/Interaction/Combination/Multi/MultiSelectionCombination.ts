import { MovingInteractionContext } from '../../../Menu/Smart/MovingInteractionContext';
import { ICombination } from '../ICombination';
import { CombinationContext } from '../CombinationContext';
import { InteractionMode } from '../../InteractionMode';
import { Point } from '../../../Utils/Geometry/Point';
import { InteractionKind } from '../../IInteractionContext';

export class MultiSelectionCombination implements ICombination {
	constructor(private _interactionContext: MovingInteractionContext) {}

	IsMatching(context: CombinationContext): boolean {
		return context.ContextMode === InteractionMode.MultipleSelection;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (context.InteractionKind === InteractionKind.Down) {
				this._interactionContext.Start();
			}

			if (context.InteractionKind === InteractionKind.Moving) {
				this._interactionContext.Moving(new Point(context.Point.x, context.Point.y));
			}

			if (
				context.InteractionKind === InteractionKind.Up ||
				context.InteractionKind === InteractionKind.MovingUp
			) {
				return false;
			}

			return true;
		}
		return false;
	}
}
