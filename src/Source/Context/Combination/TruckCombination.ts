import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Ceil } from "../../Ceil";
import { SimpleOrder } from "../../Ia/SimpleOrder";
import { Vehicle } from "../../Unit/Vehicle";
import { Truck } from "../../Unit/Truck";

export class TruckCombination implements ICombination
{
    IsMatching(items: Item[]): boolean { 
        return items.length >=2 && items[0] instanceof Truck && items[1] instanceof Ceil
    } 
 
    Combine(items: Item[]): void {
        if(this.IsMatching(items))
        {
            var vehicle = <Vehicle>items[0];
            var order = new SimpleOrder(<Ceil>items[1],vehicle);
            vehicle.SetOrder(order);
            items.splice(1,1);
        }
    }
    
}