import { SimpleOrder } from "../../Ia/Order/SimpleOrder";
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";
import { Truck } from "../../Items/Unit/Truck";
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Items/Unit/Vehicle";

export class TruckCombination implements ICombination
{
    IsMatching(items: Item[]): boolean { 
        return items.length >=2 
        && items[0] instanceof Truck 
        && items[1] instanceof Ceil
    } 
 
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            var vehicle = <Vehicle>items[0];
            var order = new SimpleOrder(<Ceil>items[1],vehicle);
            vehicle.SetOrder(order);
            items.splice(1,1);
            return true;
        }
        return false;
    }
    Clear(): void {
    }
}