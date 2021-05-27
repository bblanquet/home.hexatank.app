import { GameContext } from '../../Core/Framework/GameContext';
import { InteractionContext } from './../../Core/Interaction/InteractionContext';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { IGarbage } from '../IGarbage';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
export interface IInteractionService extends IGarbage {
	Register(interaction: PIXI.InteractionManager, gameContext: GameContext): void;
	Publish(): InteractionContext;
	GetMultiSelectionContext(): MultiSelectionContext;
	OnMultiMenuShowed: LiteEvent<boolean>;
}
