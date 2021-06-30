import { IGameContext } from '../../Core/Framework/Context/IGameContext';
import { InteractionContext } from './../../Core/Interaction/InteractionContext';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IGarbage } from '../IGarbage';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
export interface IInteractionService<T extends IGameContext> extends IGarbage {
	Register(interaction: PIXI.InteractionManager, gameContext: T): void;
	Publish(): InteractionContext;
	GetMultiSelectionContext(): MultiSelectionContext;
	OnMultiMenuShowed: LiteEvent<boolean>;
}
