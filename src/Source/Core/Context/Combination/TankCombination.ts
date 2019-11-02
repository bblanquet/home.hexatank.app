import { PersistentOrder } from './../../Ia/Order/PersistentOrder';
import { ICombination } from "./ICombination";
import { TargetOrder } from "../../Ia/Order/TargetOrder";
import { SimpleOrder } from "../../Ia/Order/SimpleOrder";
import { Item } from "../../Items/Item";
import { Tank } from "../../Items/Unit/Tank";
import { Ceil } from "../../Ceils/Ceil";
import { IContextContainer } from "../IContextContainer";
import { ISelectable } from "../../ISelectable";

export class TankCombination implements ICombination{ 
    private _interactionContext:IContextContainer;

    constructor(interactionContext:IContextContainer){   
        this._interactionContext = interactionContext;
    }
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
                const order = new PersistentOrder(ceil,tank);
                tank.SetOrder(order);
                items.splice(1,1);
                // this.UnSelectItem(items[0]);
                // this._interactionContext.ClearContext();
            }
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
    private UnSelectItem(item: Item) {            
        var selectable = <ISelectable> <any> (item);
        selectable.SetSelected(false);
    }

}