import { SimpleOrder } from "../../Ia/Order/SimpleOrder";
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";
import { Truck } from "../../Items/Unit/Truck";
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { IContextContainer } from "../IContextContainer";
import { ISelectable } from "../../ISelectable";
import { PersistentOrder } from "../../Ia/Order/PersistentOrder";

export class TruckCombination implements ICombination
{
    private _interactionContext:IContextContainer;

    constructor(interactionContext:IContextContainer){  
        this._interactionContext = interactionContext;
    }

    IsMatching(items: Item[]): boolean { 
        return items.length >=2 
        && items[0] instanceof Truck 
        && items[1] instanceof Ceil
    } 
 
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            var vehicle = <Vehicle>items[0];
            var order = new PersistentOrder(<Ceil>items[1],vehicle);
            vehicle.SetOrder(order);
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