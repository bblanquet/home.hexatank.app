import { InteractionKind } from './../IInteractionContext';
import { Item } from '../../Items/Item';
import { InteractionMode } from '../InteractionMode';

export class CombinationContext {
	public Items: Array<Item>;
	public InteractionKind: InteractionKind;
	public ContextMode: InteractionMode;
	public Point: PIXI.Point;
}
