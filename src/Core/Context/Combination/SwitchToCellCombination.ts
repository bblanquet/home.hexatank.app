import { ICombination } from "./ICombination";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Cell } from "../../Cell/Cell";
import { CombinationContext } from "./CombinationContext";
import { InfluenceField } from "../../Cell/Field/InfluenceField";
import { Headquarter } from "../../Cell/Field/Headquarter";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";
import { ISelectable } from "../../ISelectable";

export class SwitchToCellCombination implements ICombination{

    constructor(){
    }

    IsMatching(context: CombinationContext): boolean { 
        return this.IsNormalMode(context) 
        && context.Items.length == 2 
        && (context.Items[0] instanceof Headquarter 
            ||context.Items[0] instanceof InfluenceField)
        && context.Items[1] instanceof Cell;
    }    

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context))
        {
            const selectable = context.Items[0] as any as ISelectable;
            selectable.SetSelected(false);
            const cell = context.Items[1] as Cell;
            cell.SetSelected(true);
            context.Items.splice(0,1);
            return true;
        }
        return false;
    }
    Clear(): void {
    }
}