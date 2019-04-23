import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Vehicle } from "../../Unit/Vehicle";
import { Headquarter } from "../../Field/Headquarter";
import { ISelectable } from "../../ISelectable";
import { Ceil } from "../../Ceil";
import { Menu } from "../../Menu/Menu";

export class SwitchToHeadquarterCombination implements ICombination{
    constructor(private _menus:Menu[]){
    }

    IsMatching(items: Item[]): boolean 
    {
        return items.length == 2 
        && (items[0] instanceof Vehicle ||  items[0] instanceof Ceil)
        && items[1] instanceof Headquarter;    
    }    
    
    Combine(items: Item[]): boolean 
    {
        if(this.IsMatching(items))
        {
            const hq = items[0] as any as ISelectable;
            hq.SetSelected(false);
            const vehicle = items[1] as Headquarter;
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