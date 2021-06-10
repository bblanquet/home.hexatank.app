import { UnitGroup } from '../../../Items/UnitGroup';
import { CombinationContext } from '../CombinationContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { Cell } from '../../../Items/Cell/Cell';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { Singletons, SingletonKey } from '../../../../Singletons';

export class MultiUnitOneCellOrderCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;

	constructor(private _multiSelectionContext: MultiSelectionContext) {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.length === 2 && context.Items[0] instanceof UnitGroup && context.Items[1] instanceof Cell;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const group = context.Items[0] as UnitGroup;
			if (this._multiSelectionContext.IsListening()) {
				this._multiSelectionContext.Close();
				this._layerService.StartNavigation();
			}
			if (group.IsListeningOrder) {
				group.IsListeningOrder = false;
			}
			group.SetOrder([ context.Items[1] as Cell ]);
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
