import { IGameworld } from '../../Core/Framework/World/IGameworld';
import { InteractionContext } from './../../Core/Interaction/InteractionContext';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IGarbage } from '../IGarbage';
import { MultiSelectionContext } from '../../Core/Menu/Smart/MultiSelectionContext';
import { InteractionManager } from 'pixi.js';
export interface IInteractionService<T extends IGameworld> extends IGarbage {
	Register(interaction: InteractionManager, gameworld: T): void;
	Publish(): InteractionContext;
	GetMultiSelectionContext(): MultiSelectionContext;
	OnMultiMenuShowed: LiteEvent<boolean>;
}
