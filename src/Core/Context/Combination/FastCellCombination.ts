import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { SpeedFieldMenuItem } from "../../Menu/Buttons/SpeedFieldMenuItem";
import { Cell } from "../../Cell/Cell";
import { BasicField } from "../../Cell/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { FastField } from "../../Cell/Field/FastField";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler"; 
import { PacketKind } from "../../../Menu/Network/PacketKind";
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";
import { GameSettings } from "../../Utils/GameSettings";

export class FastCellCombination implements ICombination{

    IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context)
        && context.Items.length >=2 
        && context.Items[0] instanceof Cell
        && context.Items[1] instanceof SpeedFieldMenuItem 
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context)) 
        {
            let cell = <Cell> context.Items[0];
            if(!isNullOrUndefined(cell))
            {
                if(cell.GetField() instanceof BasicField)
                {
                    if(PlaygroundHelper.PlayerHeadquarter.HasMoney(GameSettings.FieldPrice))
                    {
                        PlaygroundHelper.PlayerHeadquarter.Buy(GameSettings.FieldPrice);
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
                            cell:cell.GetCoordinate(),
                            Type:"Fast"
                        });
                        let field = new FastField(cell);
                        PlaygroundHelper.Playground.Items.push(field);
                    }
                }
            }
            context.Items.splice(0,2);
            cell.SetSelected(false);
            return true;
        }
        return false;
    }
    public Clear(): void {
    }
    
}