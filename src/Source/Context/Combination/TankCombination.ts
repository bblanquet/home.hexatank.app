import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Tank } from "../../Unit/Tank";
import { Ceil } from "../../Ceil";
import { SimpleTankOrder } from "../../Ia/SimpleTankOrder";

export class TankCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length >=2 
        && items[0] instanceof Tank 
        && items[1] instanceof Ceil
    }
    Combine(items: Item[]): boolean 
    {
        if(this.IsMatching(items))
        {
            const vehicle = <Tank>items[0];
            const ceil = <Ceil>items[1];
            if(ceil.GetOccupier() === vehicle)
            {
                vehicle.SetSelected(false);
                items = [];
            }
            else
            {
                const order = new SimpleTankOrder(ceil,vehicle);
                vehicle.SetOrder(order);
                items.splice(1,1);
            }
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
}