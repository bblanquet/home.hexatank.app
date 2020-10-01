import { TYPES } from '../../types';
import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { CombinationProvider } from './../../Core/Interaction/CombinationProvider';
import { SelectableChecker } from './../../Core/Interaction/SelectableChecker';
import { GameContext } from './../../Core/Framework/GameContext';
import { inject, injectable } from 'inversify';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';

@injectable()
export class InteractionService implements IInteractionService {
	@inject(TYPES.Empty) private _layerService: ILayerService;

	private _interactionManager: PIXI.interaction.InteractionManager;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean>;

	Register(pixi: PIXI.Application, gameContext: GameContext): void {
		this._inputNotifier = new InputNotifier();
		this._interactionManager = new PIXI.interaction.InteractionManager(pixi.renderer);
		const checker = new SelectableChecker(gameContext.GetMainHq());
		const context = new InteractionContext(
			this._inputNotifier,
			new CombinationProvider().GetCombination(checker, gameContext),
			checker,
			this._layerService.GetViewport()
		);
		context.Listen();
		this._interactionManager.on(
			'pointerdown',
			this._inputNotifier.HandleMouseDown.bind(this._inputNotifier),
			false
		);
		this._interactionManager.on(
			'pointermove',
			this._inputNotifier.HandleMouseMove.bind(this._inputNotifier),
			false
		);
		this._interactionManager.on('pointerup', this._inputNotifier.HandleMouseUp.bind(this._inputNotifier), false);
		this._interactionManager.autoPreventDefault = false;
	}

	Publish(): InteractionContext {
		return this._interaction;
	}

	Collect(): void {
		this._interactionManager.destroy();
		this._inputNotifier.Clear();
	}
}
