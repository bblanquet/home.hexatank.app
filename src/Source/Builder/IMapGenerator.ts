import { Item } from "../Item";
import { Headquarter } from "../Field/Headquarter";

export interface IMapGenerator{
    SetMap():Array<Item>;
    GetHq():Headquarter;
}