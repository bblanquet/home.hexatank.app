import { CellGroup } from './../../../Items/CellGroup';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { CombinationContext } from '../CombinationContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { InteractionKind } from '../../IInteractionContext';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { GameContext } from '../../../Setup/Context/GameContext';
import { UnitGroup } from '../../../Items/UnitGroup';

export class ClearActiveMultiSelectionCombnation extends AbstractSingleCombination {
	private _interactionService: IInteractionService<GameContext>;
	private _layerService: ILayerService;

	constructor(private _multiSelectionContext: MultiSelectionContext) {
		super();
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this._multiSelectionContext.IsListening() &&
			context.InteractionKind === InteractionKind.Up &&
			!(context.Items[0] instanceof UnitGroup || context.Items[0] instanceof CellGroup)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._layerService.StartNavigation();
			this._multiSelectionContext.Close();
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}
}
