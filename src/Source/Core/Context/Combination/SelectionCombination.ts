import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { ISelectable } from "../../ISelectable";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { CeilState } from "../../Ceils/CeilState";

export class SelectionCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean};

    constructor(isSelectable:{(item:Item):boolean}){
        this._isSelectable = isSelectable;
    }

    IsMatching(items: Item[]): boolean {
        return items.length === 1 && this._isSelectable(items[0]);
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            const item = items[0];
            const selectable = this.ToSelectableItem(item);
            if(selectable instanceof Ceil){
                const selectableCeil = selectable as Ceil;
                
                if(selectableCeil.GetField() instanceof BasicField 
                    && selectableCeil.GetState() === CeilState.Visible)
                {
                    selectable.SetSelected(true); 
                    PlaygroundHelper.SelectedItem.trigger(this,item);
                }
                else
                {
                    return false;   
                }
            }
            else
            {
                selectable.SetSelected(true); 
                PlaygroundHelper.SelectedItem.trigger(this,item);
            }
            return true;   
        }
        return false;
    }

    private IsSelectableItem(item: any):item is ISelectable{
        return 'SetSelected' in item;
    }

    private ToSelectableItem(item: any):ISelectable{
        if(this.IsSelectableItem(item)){
            return <ISelectable> item;
        }
        return null;
    }

    Clear(): void {
    }
}