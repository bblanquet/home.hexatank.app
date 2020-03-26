import { InteractionKind, IInteractionContext } from './../../IInteractionContext';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from '../ICombination';
import { CombinationContext } from '../CombinationContext';
import { Point } from '../../../Utils/Geometry/Point';
import { PlaygroundHelper } from '../../../Framework/PlaygroundHelper';
import { InteractionMode } from '../../InteractionMode';

export class DisplayMultiMenuCombination implements ICombination {
	constructor(private _interactionContext: IInteractionContext, private _multiselection: MultiSelectionMenu) {}

	IsMatching(context: CombinationContext): boolean {
		return (
			context.ContextMode === InteractionMode.SingleSelection &&
			context.InteractionKind === InteractionKind.Holding &&
			context.Items.length === 0
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._multiselection.Show(new Point(context.Point.x, context.Point.y));
			this._interactionContext.Mode = InteractionMode.SelectionMenu;
			PlaygroundHelper.PauseNavigation();
			return true;
		}
		return false;
	}

	Clear(): void {}
}
