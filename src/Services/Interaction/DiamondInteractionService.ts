import { DiamondContext } from './../../Core/Setup/Context/DiamondContext';
import { CombinationProvider } from './../../Core/Interaction/CombinationProvider';
import { SelectableChecker } from './../../Core/Interaction/SelectableChecker';
import { IInteractionService } from './IInteractionService';
import { InputNotifier } from '../../Core/Interaction/InputNotifier';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Singletons, SingletonKey } from '../../Singletons';
import { ILayerService } from '../Layer/ILayerService';

export class DiamondInteractionService implements IInteractionService<DiamondContext> {
	private _layerService: ILayerService;
	private _multiSelectionContext: MultiSelectionContext;
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor() {
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	Register(manager: PIXI.InteractionManager, gameContext: DiamondContext): void {
		this._multiSelectionContext = new MultiSelectionContext();
		this._inputNotifier = new InputNotifier();
		const checker = new SelectableChecker(gameContext.GetPlayer().Identity);
		this._interaction = new InteractionContext(
			this._inputNotifier,
			new CombinationProvider().GetCombination(checker, this._multiSelectionContext, gameContext),
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
