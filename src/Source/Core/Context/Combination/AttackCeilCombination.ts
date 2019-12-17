import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { AttackMenuItem } from "../../Menu/Buttons/AttackMenuItem";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { AttackField } from "../../Ceils/Field/AttackField";
import { PacketKind } from "../../../Menu/Network/PacketKind";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler"; 
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";

export class AttackCellCombination implements ICombination{ 

    IsMatching(combination: CombinationContext): boolean {
        return this.IsNormalMode(combination) 
        && combination.Items.length >=2 
        && combination.Items[0] instanceof Ceil
        && combination.Items[1] instanceof AttackMenuItem 
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    }

    Combine(combination: CombinationContext): boolean {
        if(this.IsMatching(combination))
        {
            let ceil = <Ceil> combination.Items[0];
            if(!isNullOrUndefined(ceil))
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    if(PlaygroundHelper.PlayerHeadquarter.HasMoney(PlaygroundHelper.Settings.FieldPrice))
                    {
                        PlaygroundHelper.PlayerHeadquarter.Buy(PlaygroundHelper.Settings.FieldPrice);
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:ceil.GetCoordinate(),
                            Type:"Attack"
                        });
                        let field = new AttackField(ceil);
                        PlaygroundHelper.Playground.Items.push(field);
                    }
                }
            }
            combination.Items.splice(0,2);
            ceil.SetSelected(false);
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
}