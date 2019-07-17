import { Item } from "../Items/Item";

export interface IInteractionContext{
    ClearContext():void;
    Push(item: Item, forced:boolean):void;
}