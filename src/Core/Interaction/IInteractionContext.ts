import { ViewContext } from './../../Utils/Geometry/ViewContext';
import { Item } from '../Items/Item';
import { Point } from 'pixi.js';

export interface IInteractionContext {
	Kind: InteractionKind;
	Point: Point;
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
