import { ViewContext } from './../Utils/Geometry/ViewContext';
import { Item } from '../Items/Item';

export interface IInteractionContext {
	Kind: InteractionKind;
	Point: PIXI.Point;
	OnSelect(item: Item): void;
	View: ViewContext;
}

export enum InteractionKind {
	Down,
	Up,
	MovingUp,
	Moving,
	DoubleClick
}
