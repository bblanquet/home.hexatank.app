import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { ISelectable } from "../../ISelectable";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Items/Unit/Vehicle";

export class SwitchToVehicleCombination implements ICombination{ 
    
    constructor(){
    }

    public IsMatching(items: Item[]): boolean {
        return items.length == 2  
        && (items[0] instanceof Ceil)
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
            PlaygroundHelper.SelectedItem.trigger(this,vehicle);
            items.splice(0,1);
            return true;
        }
        return false;
    }

    Clear(): void 
    {
    }
}