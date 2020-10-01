import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { CombinationProvider } from './../../Core/Interaction/CombinationProvider';
import { SelectableChecker } from './../../Core/Interaction/SelectableChecker';
import { GameContext } from './../../Core/Framework/GameContext';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Factory, FactoryKey } from '../../Factory';
import * as PIXI from 'pixi.js';

export class InteractionService implements IInteractionService {
	private _layerService: ILayerService;

	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor() {
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
	}

	Register(manager: PIXI.interaction.InteractionManager, gameContext: GameContext): void {
		this._inputNotifier = new InputNotifier();
		const checker = new SelectableChecker(gameContext.GetMainHq());
		this._interaction = new InteractionContext(
			this._inputNotifier,
			new CombinationProvider().GetCombination(checker, gameContext),
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
