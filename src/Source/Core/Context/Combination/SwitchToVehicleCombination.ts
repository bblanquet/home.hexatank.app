import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { ISelectable } from "../../ISelectable";
import { Ceil } from "../../Ceils/Ceil";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';

export class SwitchToVehicleCombination implements ICombination{ 
    
    constructor(){
    }

    public IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context) 
        && context.Items.length == 2  
        && (context.Items[0] instanceof Ceil)
        && context.Items[1] instanceof Vehicle;
    }    
    
    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.Kind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean 
    {
        if(this.IsMatching(context))
        {
            const hq = context.Items[0] as any as ISelectable;
            hq.SetSelected(false);
            const vehicle = context.Items[1] as Vehicle;
            vehicle.SetSelected(true);
            PlaygroundHelper.SelectedItem.trigger(this,vehicle);
            context.Items.splice(0,1);
            return true;
        }
        return false;
    }

    Clear(): void 
    {
    }
}