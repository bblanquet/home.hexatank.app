import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Tank } from "../../Unit/Tank";
import { Ceil } from "../../Ceil";
import { SimpleTankOrder } from "../../Ia/SimpleTankOrder";
import { SimpleOrder } from "../../Ia/SimpleOrder";
import { TargetOrder } from "../../Ia/TargetOrder";

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
            const tank = <Tank>items[0];
            const ceil = <Ceil>items[1];
            if(ceil.GetShootableEntity() !== null
            && ceil.GetShootableEntity().IsEnemy(tank))
            {
                const order = new TargetOrder(tank,ceil.GetShootableEntity());
                tank.SetOrder(order);
                items.splice(1,1);
            }
            else
            {
                const order = new SimpleOrder(ceil,tank);
                tank.SetOrder(order);
                items.splice(1,1);
            }
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
}