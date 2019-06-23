import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Headquarter } from "../../Ceils/Field/Headquarter";
import { Vehicle } from "../../Unit/Vehicle";
import { Ceil } from "../../Ceils/Ceil";
import { ISelectable } from "../../ISelectable";
import { Menu } from "../../Menu/Menu";

export class SwitchToVehicleCombination implements ICombination{ 
    
    constructor(private _menus:Menu[]){
    }

    public IsMatching(items: Item[]): boolean {
        return items.length == 2  
        && (items[0] instanceof Headquarter || items[0] instanceof Ceil)
        && items[1] instanceof Vehicle;
    }    
    
    Combine(items: Item[]): boolean 
    {
        if(this.IsMatching(items))
        {
            const hq = items[0] as any as ISelectable;
            hq.SetSelected(false);
            const vehicle = items[1] as Vehicle;
            vehicle.SetSelected(true);
            this._menus.forEach(menu=>{menu.Show(vehicle);});
            items.splice(0,1);
            return true;
        }
        return false;
    }

    Clear(): void 
    {
    }
}