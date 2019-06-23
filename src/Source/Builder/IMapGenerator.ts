import { Item } from "../Item";
import { Headquarter } from "../Ceils/Field/Headquarter";
import { Menu } from "../Menu/Menu";

export interface IMapGenerator{ 
    SetMap():Array<Item>;
    GetHq():Headquarter;
    GetMenus():Menu[];
}