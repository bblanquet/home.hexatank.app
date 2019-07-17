import { ICombination } from "./ICombination";
import { Menu } from "../../Menu/Menu";
import { Item } from "../../Items/Item";
import { Headquarter } from "../../Ceils/Field/Headquarter";
import { Ceil } from "../../Ceils/Ceil";

export class SwitchToCeilCombination implements ICombination{
    constructor(private _menus:Menu[]){
    }

    IsMatching(items: Item[]): boolean { 
        return items.length == 2 
        && (items[0] instanceof Headquarter)
        && items[1] instanceof Ceil;
    }    
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            const hq = items[0] as Headquarter;
            hq.SetSelected(false);
            const vehicle = items[1] as Ceil;
            vehicle.SetSelected(true);
            this._menus.forEach(menu=>{menu.Show(vehicle);});
            items.splice(0,1);
            return true;
        }
        return false;
    }
    Clear(): void {
    }


}