import { ISelectable } from '../../ISelectable';
import { CancelMenuItem } from '../../Menu/Buttons/CancelMenuItem';
import { Item } from '../../Items/Item';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { Singletons, SingletonKey } from '../../../Singletons';
import { ILayerService } from '../../../Services/Layer/ILayerService';

export class CancelCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;
	constructor() {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.filter((i) => i instanceof CancelMenuItem).length >= 1 && context.Items.length >= 2;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._layerService.StartNavigation();
			this.UnSelectItem(context.Items[0]);
			this.ClearContext.Invoke();

			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
