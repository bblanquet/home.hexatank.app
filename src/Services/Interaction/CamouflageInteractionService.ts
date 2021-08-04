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
	private _layerService: ILayerService;
	private _multiSelectionContext: MultiSelectionContext;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor() {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	Register(manager: PIXI.InteractionManager, gameContext: Camouflageworld): void {
		this._multiSelectionContext = new MultiSelectionContext();
		this._inputNotifier = new InputNotifier();
		const checker = new SelectableChecker(gameContext.GetPlayer().Identity);
		this._interaction = new InteractionContext(
			this._inputNotifier,
			[
				new CancelCombination(),
				new AbortCombination(),
				new TankCombination(),
				new SimpleUnselectCombination(checker, gameContext),
				new CamouflageCombination(),
				new ClearTrashCombination(checker),
				new SimpleSelectionCombination(checker, gameContext)
			],
			checker,
			this._layerService.GetViewport(),
			gameContext
		);
		this._interaction.Listen();
		(manager as any).on('pointerdown', this._inputNotifier.HandleMouseDown.bind(this._inputNotifier), false);
		(manager as any).on('pointermove', this._inputNotifier.HandleMouseMove.bind(this._inputNotifier), false);
		(manager as any).on('pointerup', this._inputNotifier.HandleMouseUp.bind(this._inputNotifier), false);
		manager.autoPreventDefault = false;
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
