import { InteractionKind } from './../IInteractionContext';
import { Item } from '../../Items/Item';
import { Point } from 'pixi.js';

export class CombinationContext {
	public Items: Array<Item>;
	public InteractionKind: InteractionKind;
	public Point: Point;
}
