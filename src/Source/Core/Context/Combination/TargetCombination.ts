import { ICombination } from "./ICombination";
import { TargetMenuItem } from "../../Menu/Buttons/TargetMenuItem"; 
import { TargetOrder } from "../../Ia/Order/TargetOrder"; 
import { Item } from "../../Items/Item";
import { Tank } from "../../Items/Unit/Tank"; 
import { Ceil } from "../../Ceils/Ceil";
import { IContextContainer } from "../IContextContainer";
import { ISelectable } from "../../ISelectable";

export class TargetCombination implements ICombination{
    private _interactionContext:IContextContainer;

    constructor(interactionContext:IContextContainer){   
        this._interactionContext = interactionContext;
    }

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
            this.UnSelectItem(items[0]);
            this._interactionContext.ClearContext();
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