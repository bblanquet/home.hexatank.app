import { TruckMenuItem } from '../../Menu/Buttons/TruckMenuItem';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext'; 

export class AddTruckCombination implements ICombination{

    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context) 
        && context.Items.length >=1
        && context.Items[context.Items.length-1] instanceof TruckMenuItem 
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context))
        {
            PlaygroundHelper.PlayerHeadquarter.AddTruckRequest();
            context.Items.splice(context.Items.length-1,1);
            return true;
        } 
        return false;
    }

    Clear(): void {
    }
    
}