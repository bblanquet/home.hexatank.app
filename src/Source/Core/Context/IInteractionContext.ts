import { ContextMode } from './../Utils/ContextMode';
import { Item } from "../Items/Item";

export interface IInteractionContext{
    Kind:InteractionKind;
    Mode:ContextMode;
    Point:PIXI.Point;
    OnSelect(item:Item):void
}

export enum InteractionKind{
    Down,
    Up,
    Moving,
    Holding,
}