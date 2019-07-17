import { ICombination } from "./ICombination";
import { IInteractionContext } from "../IInteractionContext";
import { Item } from "../../Items/Item";

export class ClearTrashCombination implements ICombination{
    private _isSelectable:{(item:Item):boolean};
    private _interactionContext:IInteractionContext;

    constructor(isSelectable:{(item:Item):boolean},interactionContext:IInteractionContext){
        this._isSelectable = isSelectable;
        this._interactionContext = interactionContext;
    }
    
    IsMatching(items: Item[]): boolean {
        return items.filter(i=> this._isSelectable(i)).length == 0;
    }    
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            this._interactionContext.ClearContext();
            return true;
        }
        return false;
    }
    
    Clear(): void {
    }
}