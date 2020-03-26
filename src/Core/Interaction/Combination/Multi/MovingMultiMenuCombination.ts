import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from '../ICombination';
import { CombinationContext } from '../CombinationContext';
import { Point } from '../../../Utils/Geometry/Point';
import { InteractionMode } from '../../InteractionMode';
import { InteractionKind } from '../../IInteractionContext';

export class MovingMultiMenuCombination implements ICombination {
	constructor(private _multiselection: MultiSelectionMenu) {}

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
	Clear(): void {}
}
