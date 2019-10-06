import { ICombination } from "./ICombination";
import { IContextContainer } from "../IContextContainer";
import { ISelectable } from "../../ISelectable";
import { CancelMenuItem } from "../../Menu/Buttons/CancelMenuItem";
import { Item } from "../../Items/Item";

export class CancelCombination implements ICombination{
    private _interactionContext:IContextContainer;

    constructor(interactionContext:IContextContainer){  
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
    }
}