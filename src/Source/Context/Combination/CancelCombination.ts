import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { IInteractionContext } from "../IInteractionContext";
import { ISelectable } from "../../ISelectable";
import { CancelMenuItem } from "../../Menu/CancelMenuItem";

export class CancelCombination implements ICombination{
    private _interactionContext:IInteractionContext;

    constructor(interactionContext:IInteractionContext){
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