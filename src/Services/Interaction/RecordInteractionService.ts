import { TrackingClearTrashCombination } from './../../Core/Interaction/Combination/TrackingClearTrashCombination';
import { TrackingSelectableChecker } from './../../Core/Interaction/TrackingSelectable';
import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { CancelCombination } from '../../Core/Interaction/Combination/CancelCombination';
import { ClearTrashCombination } from '../../Core/Interaction/Combination/ClearTrashCombination';
import { SelectionCombination } from '../../Core/Interaction/Combination/SelectionCombination';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';

export class RecordInteractionService implements IInteractionService<GameContext> {
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();
	private _layerService: ILayerService;

	constructor() {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	Register(manager: PIXI.InteractionManager, gameContext: GameContext): void {
		this._inputNotifier = new InputNotifier();
		const checker = new TrackingSelectableChecker();
		this._interaction = new InteractionContext(
			this._inputNotifier,
			[
				new CancelCombination(),
				new ClearTrashCombination(checker),
				new SelectionCombination(checker, gameContext),
				new TrackingClearTrashCombination()
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
		return null;
	}

	Publish(): InteractionContext {
		return this._interaction;
	}

	Collect(): void {
		this.OnMultiMenuShowed.Clear();
		this._inputNotifier.Clear();
	}
}
