import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { IInteractionContext } from "../IInteractionContext";
import { ISelectable } from "../../ISelectable";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { CancelMenuItem } from "../../Menu/CancelMenuItem";

export class CancelCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean};
    private _interactionContext:IInteractionContext;

    constructor(isSelectable:{(item:Item):boolean},interactionContext:IInteractionContext){
        this._isSelectable = isSelectable;
        this._interactionContext = interactionContext;
    }
    
    IsMatching(items: Item[]): boolean {
        return items.filter(i=> i instanceof CancelMenuItem).length >= 1 && items.length >=2;
    }    
    
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
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
        PlaygroundHelper.OnUnselectedItem.trigger(this,selectable); 
    }
}