import { DiamondFieldOrder } from './../../Ia/Order/DiamondFieldOrder';
import { TruckPatrolOrder } from './../../Ia/Order/TruckPatrolOrder';
import { SimpleOrder } from "../../Ia/Order/SimpleOrder";
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";
import { Truck } from "../../Items/Unit/Truck";
import { Ceil } from "../../Ceils/Ceil";
import { Diamond } from "../../Ceils/Field/Diamond";
import { HqFieldOrder } from '../../Ia/Order/HqFieldOrder';
import { IContextContainer } from '../IContextContainer';
import { ISelectable } from '../../ISelectable'; 

export class TruckDiamondCombination implements ICombination
{
    private _interactionContext:IContextContainer;

    constructor(interactionContext:IContextContainer){  
        this._interactionContext = interactionContext;
    }

    IsMatching(items: Item[]): boolean { 
        return items.length >=2 
        && items[0].constructor.name === Truck.name 
        && items[1].constructor.name === Ceil.name
        && (items[1] as Ceil).GetField().constructor.name == Diamond.name
    } 
 
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            let truck = <Truck>items[0];
            let diamond = <Diamond>(items[1] as Ceil).GetField();
            let order = new TruckPatrolOrder(truck, new HqFieldOrder(truck.Hq,truck),new DiamondFieldOrder(diamond,truck));
            truck.SetOrder(order);
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