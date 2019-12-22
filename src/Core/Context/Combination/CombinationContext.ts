import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';
import { Item } from "../../Items/Item";

export class CombinationContext{
    public Items:Array<Item>;
    public InteractionKind:InteractionKind;
    public ContextMode:ContextMode;
    public Point:PIXI.Point;
}