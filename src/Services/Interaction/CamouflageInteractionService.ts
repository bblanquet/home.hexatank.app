import { SimpleSelectionCombination } from './../../Core/Interaction/Combination/SimpleSelectionCombination';
import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { SelectableChecker } from './../../Core/Interaction/SelectableChecker';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { CancelCombination } from '../../Core/Interaction/Combination/CancelCombination';
import { ClearTrashCombination } from '../../Core/Interaction/Combination/ClearTrashCombination';
import { AbortCombination } from '../../Core/Interaction/Combination/AbortCombination';
import { CamouflageCombination } from '../../Core/Interaction/Combination/CamouflageCombination';
import { SimpleUnselectCombination } from '../../Core/Interaction/Combination/SimpleUnselectCombination';
import { Camouflageworld } from '../../Core/Framework/World/Camouflageworld';
import { TankCombination } from '../../Core/Interaction/Combination/TankCombination';

export class CamouflageInteractionService implements IInteractionService<Camouflageworld> {
	private _multiSelectionContext: MultiSelectionContext;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	Register(manager: PIXI.InteractionManager, gameworld: Camouflageworld): void {
		this._multiSelectionContext = new MultiSelectionContext();
		const layer = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._inputNotifier = new InputNotifier(manager, layer.GetViewport());
		const checker = new SelectableChecker(gameworld.GetPlayer().Identity);
		this._interaction = new InteractionContext(
			this._inputNotifier,
			[
				new CancelCombination(),
				new AbortCombination(),
				new TankCombination(),
				new SimpleUnselectCombination(checker, gameworld),
				new CamouflageCombination(),
				new ClearTrashCombination(checker),
				new SimpleSelectionCombination(checker, gameworld)
			],
			checker,
			gameworld.State
		);
	}

	GetMultiSelectionContext(): MultiSelectionContext {
		return this._multiSelectionContext;
	}

	Publish(): InteractionContext {
		return this._interaction;
	}

	Collect(): void {
		this.OnMultiMenuShowed.Clear();
		this._inputNotifier.Clear();
	}
}
