import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { MultiCellMenuItem } from '../../../Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../../Menu/Buttons/MultiTankMenuItem';
import { lazyInject } from '../../../../inversify.config';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { TYPES } from '../../../../types';

export class ClearMultiSelectionMenuCombination extends AbstractSingleCombination {
	private _isShowing: boolean = false;
	@lazyInject(TYPES.Empty) private _interactionService: IInteractionService;

	constructor() {
		super();
		this._interactionService.OnMultiMenuShowed.On((src: any, isShowing) => {
			this._isShowing = isShowing;
		});
	}

	IsMatching(context: CombinationContext): boolean {
		return !(
			context.Items.length === 1 &&
			(context.Items[0] instanceof MultiCellMenuItem || context.Items[0] instanceof MultiTankMenuItem) &&
			this._isShowing
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._interactionService.OnMultiMenuShowed.Invoke(this, false);
			return false;
		}
		return false;
	}
}
