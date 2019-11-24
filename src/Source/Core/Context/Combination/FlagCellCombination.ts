import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Ceil } from "../../Ceils/Ceil";
import { FlagCeil } from '../../Ceils/FlagCeil';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";

export class FlagCellCombination implements ICombination{
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
        && context.Items.length ===1 
        && context.Items[0] instanceof Ceil;
    }
    private IsNormalMode(context: CombinationContext) { 
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context))
        {
            let ceil = <Ceil> context.Items[0];
            if(!isNullOrUndefined(ceil) && PlaygroundHelper.IsFlagingMode)
            {
                if(!PlaygroundHelper.PlayerHeadquarter.FlagCeil)
                {
                    PlaygroundHelper.PlayerHeadquarter.FlagCeil = new FlagCeil(ceil);
                    PlaygroundHelper.Playground.Items.push(PlaygroundHelper.PlayerHeadquarter.FlagCeil);                    
                }
                else
                {
                    PlaygroundHelper.PlayerHeadquarter.FlagCeil.SetCeil(ceil);
                }
                PlaygroundHelper.IsFlagingMode = false;
            }
        }
        return false;
    }

    Clear(): void {
    }
    
}