import { InteractionContext } from './../../InteractionContext';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { InteractionKind } from "../../IInteractionContext";

export class UpMultiMenuCombination implements ICombination{
    
    constructor(private _multiselection:MultiSelectionMenu, private _interactionContext:InteractionContext){
        
    }

    IsMatching(context: CombinationContext): boolean {
        return context.ContextMode === ContextMode.SelectionMenu 
        && context.InteractionKind === InteractionKind.Up;
    }    
    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            this._interactionContext.Mode = ContextMode.MultipleSelection;
            this._multiselection.Hide();
            return true;
        }
        return false;
    }
    Clear(): void {
    }


}