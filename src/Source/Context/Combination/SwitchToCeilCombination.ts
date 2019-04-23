import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Ceil } from "../../Ceil";
import { Headquarter } from "../../Field/Headquarter";
import { Menu } from "../../Menu/Menu";

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