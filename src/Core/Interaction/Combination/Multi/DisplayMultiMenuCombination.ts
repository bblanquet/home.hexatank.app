import { AppHandler } from './../../../../Components/Canvas/AppHandler';
import { InteractionKind } from './../../IInteractionContext';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { Point } from '../../../Utils/Geometry/Point';
import { InteractionMode } from '../../InteractionMode';
import { Item } from '../../../Items/Item';
import { ISelectable } from '../../../ISelectable';

export class DisplayMultiMenuCombination extends AbstractSingleCombination {
	constructor(private _multiselection: MultiSelectionMenu, private _appHandler: AppHandler) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			context.ContextMode === InteractionMode.SingleSelection &&
			context.InteractionKind === InteractionKind.Holding
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (0 < context.Items.length) {
				this.UnSelectItem(context.Items[0]);
			}
			this.OnClearContext.Invoke();
			this._multiselection.Show(new Point(context.Point.x, context.Point.y));
			this.OnChangedMode.Invoke(this, InteractionMode.SelectionMenu);
			this._appHandler.PauseNavigation();
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
