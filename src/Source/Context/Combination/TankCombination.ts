import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Tank } from "../../Unit/Tank";
import { Ceil } from "../../Ceil";
import { SimpleTankOrder } from "../../Ia/SimpleTankOrder";
import { PlaygroundHelper } from "../../PlaygroundHelper";

export class TankCombination implements ICombination{

    constructor(){
         
    } 

    IsMatching(items: Item[]): boolean {
        return items.length >=2 
        && items[0] instanceof Tank 
        && items[1] instanceof Ceil
    }
    Combine(items: Item[]): void 
    {
        if(this.IsMatching(items))
        {
            console.log(`%c TANK MATCH`,'font-weight:bold;color:blue;');
            const vehicle = <Tank>items[0];
            const ceil = <Ceil>items[1];
            if(ceil.GetOccupier() === vehicle)
            {
                vehicle.SetSelected(false);
                PlaygroundHelper.OnUnselectedItem.trigger(this,vehicle); 
                items = [];
            }
            else
            {
                const order = new SimpleTankOrder(ceil,vehicle);
                vehicle.SetOrder(order);
                items.splice(1,1);
            }
        }
    }
    
}