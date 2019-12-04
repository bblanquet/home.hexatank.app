import { CamouflageMenuItem } from './../../Menu/Buttons/CamouflageMenutItem';
import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';
import { Tank } from '../../Items/Unit/Tank';

export class CamouflageCombination implements ICombination{
    
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context) 
        && context.Items.length ===2
        && context.Items[0] instanceof Tank
        && context.Items[1] instanceof CamouflageMenuItem;
    }    
    
    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            const tank = context.Items[0] as Tank;
            if(tank.SetCamouflage()){
                return true;
            }
            else
            {
                context.Items.splice(1,1);
                return false;
            }
        }
        return false;
    }
    Clear(): void {
    }
}