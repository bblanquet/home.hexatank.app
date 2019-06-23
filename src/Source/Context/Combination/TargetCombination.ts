import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Tank } from "../../Unit/Tank";
import { TargetMenuItem } from "../../Menu/TargetMenuItem"; 
import { Ceil } from "../../Ceils/Ceil";
import { TargetOrder } from "../../Ia/Order/TargetOrder"; 

export class TargetCombination implements ICombination{
    IsMatching(items: Item[]): boolean 
    {
        return items.length ===3
        && items[0] instanceof Tank
        && items[1] instanceof TargetMenuItem
        && items[2] instanceof Ceil
        && (items[2] as Ceil).IsShootable()
        ;
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            let tank = <Tank>items[0];
            let ceil = (items[2] as Ceil);
            let order = new TargetOrder(tank,ceil.GetShootableEntity());
            tank.SetOrder(order);
            items.splice(1,2);
            return true;
        }
        return false;
    }

    Clear(): void {
    }


}