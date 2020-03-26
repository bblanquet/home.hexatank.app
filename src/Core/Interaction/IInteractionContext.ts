import { InteractionMode } from './InteractionMode';
import { Item } from '../Items/Item';

export interface IInteractionContext {
	Kind: InteractionKind;
	Mode: InteractionMode;
	Point: PIXI.Point;
	OnSelect(item: Item): void;
}

export enum InteractionKind {
	Down,
	Up,
	MovingUp,
	Moving,
	Holding
}
