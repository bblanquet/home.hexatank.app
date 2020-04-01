import { AppHandler } from './../../../../Components/Canvas/AppHandler';
import { InteractionKind } from './../../IInteractionContext';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { Point } from '../../../Utils/Geometry/Point';
import { InteractionMode } from '../../InteractionMode';

export class DisplayMultiMenuCombination extends AbstractSingleCombination {
	constructor(private _multiselection: MultiSelectionMenu, private _appHandler: AppHandler) {
		super();
	}

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
			this.OnChangedMode.Invoke(this, InteractionMode.SelectionMenu);
			this._appHandler.PauseNavigation();
			return true;
		}
		return false;
	}
}
