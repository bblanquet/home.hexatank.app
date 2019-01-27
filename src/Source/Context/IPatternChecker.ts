import { Item } from "../Item";

export interface IPatternChecker{
    Check(items:Array<Item>):void;
} 