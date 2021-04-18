import { TrackingClearTrashCombination } from './../../Core/Interaction/Combination/TrackingClearTrashCombination';
import { TrackingSelectableChecker } from './../../Core/Interaction/TrackingSelectable';
import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { GameContext } from './../../Core/Framework/GameContext';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';
import { CancelCombination } from '../../Core/Interaction/Combination/CancelCombination';
import { ClearTrashCombination } from '../../Core/Interaction/Combination/ClearTrashCombination';
import { SelectionCombination } from '../../Core/Interaction/Combination/SelectionCombination';

export class RecordInteractionService implements IInteractionService {
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();
	private _layerService: ILayerService;

	constructor() {
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
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
			this._layerService.GetViewport()
		);
		this._interaction.Listen();
		manager.on('pointerdown', this._inputNotifier.HandleMouseDown.bind(this._inputNotifier), false);
		manager.on('pointermove', this._inputNotifier.HandleMouseMove.bind(this._inputNotifier), false);
		manager.on('pointerup', this._inputNotifier.HandleMouseUp.bind(this._inputNotifier), false);
		manager.autoPreventDefault = false;
	}

	Publish(): InteractionContext {
		return this._interaction;
	}

	Collect(): void {
		this.OnMultiMenuShowed.Clear();
		this._inputNotifier.Clear();
	}
}
