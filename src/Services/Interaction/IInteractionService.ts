import { IGameContext } from '../../Core/Framework/Context/IGameContext';
import { InteractionContext } from './../../Core/Interaction/InteractionContext';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IGarbage } from '../IGarbage';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { InteractionManager } from 'pixi.js';
export interface IInteractionService<T extends IGameContext> extends IGarbage {
	Register(interaction: InteractionManager, gameContext: T): void;
	Publish(): InteractionContext;
	GetMultiSelectionContext(): MultiSelectionContext;
	OnMultiMenuShowed: LiteEvent<boolean>;
}
