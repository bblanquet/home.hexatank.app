import { Item } from "../Items/Item";

export interface IPatternChecker{
    Check(items:Array<Item>):void;
} 