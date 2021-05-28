import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { SelectableChecker } from './../../Core/Interaction/SelectableChecker';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { CancelCombination } from '../../Core/Interaction/Combination/CancelCombination';
import { ClearTrashCombination } from '../../Core/Interaction/Combination/ClearTrashCombination';
import { SelectionCombination } from '../../Core/Interaction/Combination/SelectionCombination';
import { CamouflageGameContext } from '../../Core/Framework/CamouflageGameContext';
import { AbortCombination } from '../../Core/Interaction/Combination/AbortCombination';
import { TruckCombination } from '../../Core/Interaction/Combination/TruckCombination';
import { CamouflageCombination } from '../../Core/Interaction/Combination/CamouflageCombination';
import { UnselectCombination } from '../../Core/Interaction/Combination/UnselectCombination';

export class CamouflageInteractionService implements IInteractionService<CamouflageGameContext> {
	private _layerService: ILayerService;
	private _multiSelectionContext: MultiSelectionContext;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor() {
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
	}

	Register(manager: PIXI.InteractionManager, gameContext: CamouflageGameContext): void {
		this._multiSelectionContext = new MultiSelectionContext();
		this._inputNotifier = new InputNotifier();
		const checker = new SelectableChecker(gameContext.GetPlayer());
		this._interaction = new InteractionContext(
			this._inputNotifier,
			[
				new CancelCombination(),
				new AbortCombination(),
				new TruckCombination(),
				new UnselectCombination(checker, gameContext),
				new CamouflageCombination(),
				new ClearTrashCombination(checker),
				new SelectionCombination(checker, gameContext)
			],
			checker,
			this._layerService.GetViewport()
		);
		this._interaction.Listen();
		manager.on('pointerdown', this._inputNotifier.HandleMouseDown.bind(this._inputNotifier), false);
		manager.on('pointermove', this._inputNotifier.HandleMouseMove.bind(this._inputNotifier), false);
		manager.on('pointerup', this._inputNotifier.HandleMouseUp.bind(this._inputNotifier), false);
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