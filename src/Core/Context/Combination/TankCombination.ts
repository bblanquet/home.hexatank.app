import { PersistentOrder } from '../../Ia/Order/PersistentOrder';
import { ICombination } from "./ICombination";
import { TargetOrder } from "../../Ia/Order/TargetOrder";
import { SimpleOrder } from "../../Ia/Order/SimpleOrder";
import { Item } from "../../Items/Item";
import { Tank } from "../../Items/Unit/Tank";
import { Cell } from "../../Cell/Cell";
import { IContextContainer } from "../IContextContainer";
import { ISelectable } from "../../ISelectable";
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';

export class TankCombination implements ICombination{ 

    constructor(){   
    }
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context) && context.Items.length >=2 
        && context.Items[0] instanceof Tank 
        && context.Items[1] instanceof Cell
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean  
    {
        if(this.IsMatching(context))
        {
            const tank = <Tank>context.Items[0];
            const cell = <Cell>context.Items[1];
            if(cell.GetShootableEntity() !== null
            && cell.GetShootableEntity().IsEnemy(tank))
            {
                const order = new TargetOrder(tank,cell.GetShootableEntity());
                tank.SetOrder(order);
                context.Items.splice(1,1);
            }
            else
            {
                const order = new PersistentOrder(cell,tank);
                tank.SetOrder(order);
                context.Items.splice(1,1);
            }
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
}