import { MultiSelectionContext } from './../../Menu/Smart/MultiSelectionContext';
import { MultiOrderMenuItem } from './../../Menu/Buttons/MultiOrderMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { UnitGroup } from '../../Items/UnitGroup';
import { ILayerService } from '../../../Services/Layer/ILayerService';
import { Singletons, SingletonKey } from '../../../Singletons';

export class SwithcMultiCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;
	constructor(private _multiContext: MultiSelectionContext) {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.length >= 0 && context.Items[context.Items.length - 1] instanceof MultiOrderMenuItem;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const group = context.Items[0] as UnitGroup;
			group.IsListeningOrder = !group.IsListeningOrder;
			if (group.IsListeningOrder) {
				this._layerService.PauseNavigation();
				this._multiContext.Listen(true);
			} else {
				this._layerService.StartNavigation();
				this._multiContext.Close();
			}
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
