import { InteractionKind } from './../IInteractionContext';
import { Item } from '../../Items/Item';

export class CombinationContext {
	public Items: Array<Item>;
	public InteractionKind: InteractionKind;
	public Point: PIXI.Point;
}
