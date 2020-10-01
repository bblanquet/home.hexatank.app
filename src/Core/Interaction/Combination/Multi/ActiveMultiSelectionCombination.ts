import { ILayerService } from './../../../../Services/Layer/ILayerService';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { CombinationContext } from '../CombinationContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { MultiCellMenuItem } from '../../../Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../../Menu/Buttons/MultiTankMenuItem';
import { lazyInject } from '../../../../inversify.config';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { TYPES } from '../../../../types';

export class ActiveMultiSelectionCombination extends AbstractSingleCombination {
	@lazyInject(TYPES.Empty) private _interactionService: IInteractionService;
	@lazyInject(TYPES.Empty) private _layerService: ILayerService;

	constructor(private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			!this._multiContext.IsListening() &&
			context.Items.length === 1 &&
			(context.Items[0] instanceof MultiCellMenuItem || context.Items[0] instanceof MultiTankMenuItem)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._interactionService.OnMultiMenuShowed.Invoke(this, false);
			this._layerService.PauseNavigation();
			this._multiContext.Listen(context.Items[0] instanceof MultiTankMenuItem);
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}
}
