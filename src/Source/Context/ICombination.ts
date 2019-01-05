import { Item } from "../Item";

export interface ICombination{
    IsMatching(items:Array<Item>):boolean;
    Combine(items:Array<Item>):void;
}