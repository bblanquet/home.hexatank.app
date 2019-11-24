import { MovingInteractionContext } from '../../../Menu/Smart/MovingInteractionContext';
import { ICombination } from "../ICombination";
import { CombinationContext } from "../CombinationContext";
import { ContextMode } from "../../../Utils/ContextMode";
import { InteractionKind } from '../../IInteractionContext';
import { Point } from '../../../Utils/Point';

export class MultiSelectionCombination implements ICombination{ 
    
    constructor(private _interactionContext:MovingInteractionContext){
    }

    IsMatching(context: CombinationContext): boolean {
        return  context.ContextMode === ContextMode.MultipleSelection;
    }    

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            if(context.InteractionKind === InteractionKind.Down){
                this._interactionContext.Start();
            }
            
            if(context.InteractionKind === InteractionKind.Moving){
                this._interactionContext.Moving(new Point(context.Point.x,context.Point.y));
            }

            if(context.InteractionKind === InteractionKind.Up){
                return false;
            }

            return true;
        }
        return false;
    }
    Clear(): void {
    }


}