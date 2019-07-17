import { Headquarter } from "../Ceils/Field/Headquarter";
import { Menu } from "../Menu/Menu";
import { Item } from "../Items/Item";

export interface IMapGenerator{ 
    SetMap():Array<Item>; 
    GetHq():Headquarter;
    GetMenus():Menu[];
}