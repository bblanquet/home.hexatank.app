import { InteractionKind } from './../../IInteractionContext';
import { AbstractSingleCombination } from './../AbstractSingleCombination';
import { CombinationContext } from '../CombinationContext';
import { Item } from '../../../Items/Item';
import { ISelectable } from '../../../ISelectable';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../../Factory';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { GameContext } from '../../../Framework/GameContext';

export class DisplayMultiMenuCombination extends AbstractSingleCombination {
	private _interactionService: IInteractionService<GameContext>;
	private _layerService: ILayerService;

	constructor(private _multiSelectionContext: MultiSelectionContext) {
		super();
		this._interactionService = Factory.Load<IInteractionService<GameContext>>(FactoryKey.Interaction);
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return context.InteractionKind === InteractionKind.DoubleClick;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._layerService.StartNavigation();
			this._multiSelectionContext.Close();
			if (0 < context.Items.length) {
				this.UnSelectItem(context.Items[0]);
			}
			this.ClearContext.Invoke();
			this._interactionService.OnMultiMenuShowed.Invoke(this, true);

			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
