import { Item } from "../Item";

export interface IInteractionContext{
    ClearContext():void;
    Push(item: Item, forced:boolean):void;
}