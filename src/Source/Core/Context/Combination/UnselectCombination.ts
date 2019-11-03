import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { ISelectable } from "../../ISelectable";
import { Menu } from "../../Menu/Menu";
import { Item } from "../../Items/Item"; 
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { BasicField } from "../../Ceils/Field/BasicField";
import { CeilState } from "../../Ceils/CeilState";
import { IContextContainer } from "../IContextContainer";

export class UnselectCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean}; 
    private _interactionContext:IContextContainer;

    constructor(isSelectable:{(item:Item):boolean},interactionContext:IContextContainer){
        this._isSelectable = isSelectable;
        this._interactionContext = interactionContext;
    }
    
    IsMatching(items: Item[]): boolean {
        return items.filter(i=> this._isSelectable(i)).length >=2 && 
        (items.filter(i=> this._isSelectable(i)).length === items.filter(i=> i instanceof Ceil).length
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
                    if(lastItem instanceof Vehicle)
                    {
                        const vehicle = lastItem as Vehicle;
                        const ceil = vehicle.GetCurrentCeil();

                        if(ceil.GetField() instanceof BasicField 
                            && ceil.GetState() === CeilState.Visible)
                        {
                            this._interactionContext.Push(ceil,false);
                            ceil.SetSelected(true); 
                            PlaygroundHelper.SelectedItem.trigger(this,ceil);
                            return true;
                        }
                    }
                }
                else
                {
                    this.UnSelectItem(items[0]);
                    this._interactionContext.ClearContext();
                    this._interactionContext.Push(lastItem,true);
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