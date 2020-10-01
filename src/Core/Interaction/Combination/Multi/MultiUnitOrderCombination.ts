import { UnitGroup } from '../../../Items/UnitGroup';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { lazyInject } from '../../../../inversify.config';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { TYPES } from '../../../../types';

export class MultiUnitOrderCombination extends AbstractSingleCombination {
	@lazyInject(TYPES.Empty) private _layerService: ILayerService;

	constructor(private _multiContext: MultiSelectionContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this._multiContext.IsListeningUnit() &&
			context.Items.length === 1 &&
			context.Items[0] instanceof UnitGroup &&
			(context.Items[0] as UnitGroup).IsListeningOrder
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const group = context.Items[0] as UnitGroup;
			if (group.IsListeningOrder) {
				if (0 < this._multiContext.GetCells().length) {
					group.SetOrder(this._multiContext.GetCells());
				}
				this._multiContext.Close();
				this._layerService.StartNavigation();
				group.IsListeningOrder = false;
			}
			return true;
		}
		return false;
	}
}
