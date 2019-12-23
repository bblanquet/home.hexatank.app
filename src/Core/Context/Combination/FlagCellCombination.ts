import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Cell } from "../../Cell/Cell";
import { FlagCell } from '../../Cell/FlagCell';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";

export class FlagCellCombination implements ICombination{
    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
        && context.Items.length ===1 
        && context.Items[0] instanceof Cell;
    }
    private IsNormalMode(context: CombinationContext) { 
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context))
        {
            let cell = <Cell> context.Items[0];
            if(!isNullOrUndefined(cell) && PlaygroundHelper.IsFlagingMode)
            {
                if(!PlaygroundHelper.PlayerHeadquarter.Flagcell)
                {
                    PlaygroundHelper.PlayerHeadquarter.Flagcell = new FlagCell(cell);
                    PlaygroundHelper.Playground.Items.push(PlaygroundHelper.PlayerHeadquarter.Flagcell);                    
                }
                else
                {
                    PlaygroundHelper.PlayerHeadquarter.Flagcell.SetCell(cell);
                }
                PlaygroundHelper.IsFlagingMode = false;
            }
        }
        return false;
    }

    Clear(): void {
    }
    
}