import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { CombinationProvider } from './../../Core/Interaction/CombinationProvider';
import { SelectableChecker } from './../../Core/Interaction/SelectableChecker';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { ILayerService } from '../Layer/ILayerService';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Singletons, SingletonKey } from '../../Singletons';
import * as PIXI from 'pixi.js';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { IHqGameContext } from '../../Core/Framework/Context/IHqGameContext';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { route } from 'preact-router';

export class InteractionService implements IInteractionService<IHqGameContext> {
	private _layerService: ILayerService;
	private _multiSelectionContext: MultiSelectionContext;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor() {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	Register(manager: PIXI.InteractionManager, gameContext: IHqGameContext): void {
		this._multiSelectionContext = new MultiSelectionContext();
		this._inputNotifier = new InputNotifier();
		const checker = new SelectableChecker(gameContext.GetPlayerHq() ? gameContext.GetPlayerHq().Identity : null);
		this._interaction = new InteractionContext(
			this._inputNotifier,
			new CombinationProvider().GetCombination(checker, this._multiSelectionContext, gameContext),
			checker,
			this._layerService.GetViewport(),
			gameContext
		);
		this._interaction.OnError.On((src: any, data: Error) => {
			GameContext.Error = data;
			route('{{sub_path}}Error', true);
		});

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
