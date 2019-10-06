import { Item } from "../Items/Item";

export interface IInteractionContext{
    Point:PIXI.Point;
    OnSelect(item:Item):void
}