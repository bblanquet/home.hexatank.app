import { UnitGroup } from '../../../Items/UnitGroup';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { Singletons, SingletonKey } from '../../../../Singletons';

export class MultiUnitOrderCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;

	constructor(private _multiContext: MultiSelectionContext) {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
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
