import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { CombinationContext } from '../CombinationContext';
import { InteractionMode } from '../../InteractionMode';
import { Point } from '../../../Utils/Geometry/Point';
import { InteractionKind } from '../../IInteractionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';

export class MultiSelectionCombination extends AbstractSingleCombination {
	constructor(private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return context.ContextMode === InteractionMode.MultipleSelection;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (context.InteractionKind === InteractionKind.Down) {
				this._multiContext.Listen();
			}

			if (context.InteractionKind === InteractionKind.Moving) {
				this._multiContext.Moving(new Point(context.Point.x, context.Point.y));
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
