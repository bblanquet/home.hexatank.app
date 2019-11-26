import { InteractionContext } from './../../InteractionContext';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { InteractionKind } from "../../IInteractionContext";
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { PlaygroundHelper } from '../../../Utils/PlaygroundHelper';

export class UpMultiMenuCombination implements ICombination{
    
    constructor(private _multiselection:MultiSelectionMenu, private _interactionContext:InteractionContext){
        
    }

    IsMatching(context: CombinationContext): boolean {
        return context.ContextMode === ContextMode.SelectionMenu 
        && (context.InteractionKind === InteractionKind.MovingUp
            || context.InteractionKind === InteractionKind.Up);
    }    
    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            this._multiselection.Hide();
            if(this._multiselection.GetMode() !== SelectionMode.none)
            {
                this._interactionContext.Mode = ContextMode.MultipleSelection;
            }
            else
            {
                this._interactionContext.Mode = ContextMode.SingleSelection;
                PlaygroundHelper.RestartNavigation();
            }
            return true;
        }
        return false;
    }
    Clear(): void {
    }


}