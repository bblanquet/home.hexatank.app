import { Item } from "../Item";

export interface IInteractionContext{
    ClearContext():void;
    Push(item:Item):void;
}