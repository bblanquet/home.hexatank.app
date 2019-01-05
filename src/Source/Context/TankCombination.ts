import { ICombination } from "./ICombination";
import { Item } from "../Item";
import { Tank } from "../Tank";
import { Ceil } from "../Ceil";
import { SimpleTankOrder } from "../Ia/SimpleTankOrder";

export class TankCombination implements ICombination{

    constructor(){
        
    }

    IsMatching(items: Item[]): boolean {
        return items.length >=2 && items[0] instanceof Tank && items[1] instanceof Ceil
    }
    Combine(items: Item[]): void {
        if(this.IsMatching(items))
        {
            console.log(`%c TANK MATCH`,'font-weight:bold;color:blue;');
            var vehicle = <Tank>items[0];
            var order = new SimpleTankOrder(<Ceil>items[1],vehicle);
            vehicle.SetOrder(order);
            items.splice(1,1);
        }
    }
    
}