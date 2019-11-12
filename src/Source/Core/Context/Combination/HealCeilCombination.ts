import { ICombination } from "./ICombination";
import { HealMenuItem } from "../../Menu/Buttons/HealMenuItem";
import { isNullOrUndefined } from "util";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { HealField } from "../../Ceils/Field/HealField";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind"; 
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";

export class HealCeilCombination implements ICombination 
{

    public IsMatching(context: CombinationContext): boolean {
        return this.IsNormalMode(context) 
        && context.Items.length >=2
        && context.Items[0] instanceof Ceil
        && context.Items[1] instanceof HealMenuItem 
    }    

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.Kind === InteractionKind.Up;
    }
    
    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context))
        {
            let ceil = <Ceil> context.Items[0];
            if(!isNullOrUndefined(ceil))
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    if(PlaygroundHelper.PlayerHeadquarter.GetAmount() >= PlaygroundHelper.Settings.FieldPrice)
                    {
                        PlaygroundHelper.PlayerHeadquarter.Buy(PlaygroundHelper.Settings.FieldPrice);
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:ceil.GetCoordinate(),
                            Type:"Heal"
                        });
                        let field = new HealField(ceil);
                        PlaygroundHelper.Playground.Items.push(field);
                    }
                }
            }
            context.Items.splice(0,2);
            ceil.SetSelected(false);
            return true;
        }
        return false;
    }
    Clear(): void {
    } 
}