import { Item } from "../../Item";
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Unit/Vehicle";
import { Truck } from "../../Unit/Truck";
import { SimpleOrder } from "../../Ia/Order/SimpleOrder";
import { ICombination } from "./ICombination";

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