import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { InteractionKind, IInteractionContext } from "../../IInteractionContext";
import { Point } from '../../../Utils/Point';
import { PlaygroundHelper } from '../../../Utils/PlaygroundHelper';

export class DisplayMultiMenuCombination implements ICombination{
    constructor(private _interactionContext:IInteractionContext,private _multiselection:MultiSelectionMenu){}

    IsMatching(context: CombinationContext): boolean {
        return context.ContextMode === ContextMode.SingleSelection 
        && context.InteractionKind === InteractionKind.Holding;
    }    
    
    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            this._multiselection.Show(new Point(context.Point.x,context.Point.y));
            this._interactionContext.Mode = ContextMode.SelectionMenu;
            PlaygroundHelper.PauseNavigation();
            return true;
        }
        return false;
    }

    Clear(): void {
    }

}