import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from '../ICombination';
import { CombinationContext } from '../CombinationContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { InteractionMode } from '../../InteractionMode';
import { InteractionKind, IInteractionContext } from '../../IInteractionContext';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';

export class UpMultiMenuCombination implements ICombination {
	constructor(
		private _multiselection: MultiSelectionMenu,
		private _interactionContext: IInteractionContext,
		private _appHandler: AppHandler
	) {}

	IsMatching(context: CombinationContext): boolean {
		return (
			context.ContextMode === InteractionMode.SelectionMenu &&
			(context.InteractionKind === InteractionKind.MovingUp || context.InteractionKind === InteractionKind.Up)
		);
	}
	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._multiselection.Hide();
			if (this._multiselection.GetMode() !== SelectionMode.none) {
				this._interactionContext.Mode = InteractionMode.MultipleSelection;
			} else {
				this._interactionContext.Mode = InteractionMode.SingleSelection;
				this._appHandler.RestartNavigation();
			}
			return true;
		}
		return false;
	}
}
