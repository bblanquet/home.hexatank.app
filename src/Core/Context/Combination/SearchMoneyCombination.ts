import { MoneyOrder } from './../../Ia/Order/MoneyOrder';
import { Truck } from './../../Items/Unit/Truck';
import { SearchMoneyMenuItem } from './../../Menu/Buttons/SearchMoneyMenuItem';
import { ICombination } from "./ICombination";
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';

export class SearchMoneyCombination implements ICombination{
    
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)  
        && context.Items[0] instanceof Truck 
        && context.Items.filter(i=> i instanceof SearchMoneyMenuItem).length >= 1 
        && context.Items.length >=2;
    }    
    
    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }  
    
    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)){
            const vehicle = context.Items[0] as Truck;
            vehicle.SetOrder(new MoneyOrder(vehicle));
            context.Items = context.Items.filter(i=> !(i instanceof SearchMoneyMenuItem));
            return true;
        }
        return false;
    }
    Clear(): void {
    }
}