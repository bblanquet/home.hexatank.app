import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { InteractionKind } from "../../IInteractionContext";
import { Point } from '../../../Utils/Point';

export class MovingMultiMenuCombination implements ICombination{
    constructor(private _multiselection:MultiSelectionMenu){}
    
    IsMatching(context: CombinationContext): boolean {
        return context.ContextMode === ContextMode.SelectionMenu 
        && context.InteractionKind === InteractionKind.Moving;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            this._multiselection.OnMouseMove(new Point(context.Point.x,context.Point.y));
            return true;
        }
        return false;
    }
    Clear(): void {
    }

}