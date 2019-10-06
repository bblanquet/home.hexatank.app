import { Item } from "../Items/Item";

export interface IContextContainer{ 
     ClearContext():void;
     Push(item: Item, forced:boolean):void;
}