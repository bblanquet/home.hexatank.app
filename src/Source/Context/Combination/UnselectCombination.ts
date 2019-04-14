import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { ISelectable } from "../../ISelectable";
import { IInteractionContext } from "../IInteractionContext";
import { Ceil } from "../../Ceil";
import { Headquarter } from "../../Field/Headquarter";
import { Vehicle } from "../../Unit/Vehicle";

export class UnselectCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean};
    private _interactionContext:IInteractionContext;

    constructor(isSelectable:{(item:Item):boolean},interactionContext:IInteractionContext){
        this._isSelectable = isSelectable;
        this._interactionContext = interactionContext;
    }
    
    IsMatching(items: Item[]): boolean {
        return items.filter(i=> this._isSelectable(i)).length >=2 && 
        (items.filter(i=> this._isSelectable(i)).length === items.filter(i=> i instanceof Ceil).length
        || items.filter(i=> this._isSelectable(i)).length === items.filter(i=> i instanceof Headquarter).length
        || items.filter(i=> this._isSelectable(i)).length === items.filter(i=> i instanceof Vehicle).length);
    }    
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            const lastItem = items[items.length-1];
            if(this._isSelectable(lastItem))
            {
                if(lastItem === items[0])
                {
                    this.UnSelectItem(items[0]);
                    this._interactionContext.ClearContext();
                }
                else
                {
                    this.UnSelectItem(items[0]);
                    this._interactionContext.ClearContext();
                    this._interactionContext.Push(lastItem);
                }
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