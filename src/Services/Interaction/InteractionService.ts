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
import { IHqGameworld } from '../../Core/Framework/World/IHqGameworld';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { route } from 'preact-router';
import { ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';

export class InteractionService implements IInteractionService<IHqGameworld> {
	private _layerService: ILayerService;
	private _multiSelectionContext: MultiSelectionContext;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor() {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	Register(manager: PIXI.InteractionManager, gameworld: IHqGameworld): void {
		this._multiSelectionContext = new MultiSelectionContext();
		this._inputNotifier = new InputNotifier(manager);
		const checker = new SelectableChecker(gameworld.GetPlayerHq() ? gameworld.GetPlayerHq().Identity : null);
		const cbs = new CombinationProvider().GetCombination(checker, this._multiSelectionContext, gameworld);

		this._interaction = new InteractionContext(
			this._inputNotifier,
			cbs,
			checker,
			this._layerService.GetViewport(),
			gameworld.State
		);
		this._interaction.OnError.On((src: any, data: Error) => {
			ErrorHandler.Log(data);
			ErrorHandler.Send(data);
			Gameworld.Error = data;
			route('{{sub_path}}Error', true);
		});
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
