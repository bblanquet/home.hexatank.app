import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { CombinationContext } from '../CombinationContext';
import { Point } from '../../../Utils/Geometry/Point';
import { InteractionMode } from '../../InteractionMode';
import { InteractionKind } from '../../IInteractionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';

export class MovingMultiMenuCombination extends AbstractSingleCombination {
	constructor(private _multiselection: MultiSelectionMenu) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			context.ContextMode === InteractionMode.SelectionMenu && context.InteractionKind === InteractionKind.Moving
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._multiselection.OnMouseMove(new Point(context.Point.x, context.Point.y));
			return true;
		}
		return false;
	}
}
