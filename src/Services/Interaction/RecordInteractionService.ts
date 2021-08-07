import { TrackingClearTrashCombination } from './../../Core/Interaction/Combination/TrackingClearTrashCombination';
import { TrackingSelectableChecker } from './../../Core/Interaction/TrackingSelectable';
import { InputNotifier } from './../../Core/Interaction/InputNotifier';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { IInteractionService } from './IInteractionService';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import * as PIXI from 'pixi.js';
import { CancelCombination } from '../../Core/Interaction/Combination/CancelCombination';
import { ClearTrashCombination } from '../../Core/Interaction/Combination/ClearTrashCombination';
import { SelectionCombination } from '../../Core/Interaction/Combination/SelectionCombination';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { route } from 'preact-router';
import { ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';
import { Singletons, SingletonKey } from '../../Singletons';
import { ILayerService } from '../Layer/ILayerService';

export class RecordInteractionService implements IInteractionService<Gameworld> {
	private _inputNotifier: InputNotifier;
	private _interaction: InteractionContext;
	public OnMultiMenuShowed: LiteEvent<boolean> = new LiteEvent<boolean>();

	Register(manager: PIXI.InteractionManager, gameworld: Gameworld): void {
		const layer = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._inputNotifier = new InputNotifier(manager, layer.GetViewport());
		const checker = new TrackingSelectableChecker();
		this._interaction = new InteractionContext(
			this._inputNotifier,
			[
				new CancelCombination(),
				new ClearTrashCombination(checker),
				new SelectionCombination(checker, gameworld),
				new TrackingClearTrashCombination()
			],
			checker,
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
