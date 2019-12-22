import { InfluenceField } from '../../Ceils/Field/InfluenceField';
import { InfluenceMenuItem } from '../../Menu/Buttons/InfluenceMenuItem';
import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind"; 
import { CombinationContext } from "./CombinationContext";
import { ContextMode } from "../../Utils/ContextMode";
import { InteractionKind } from "../IInteractionContext";
import { GameSettings } from '../../Utils/GameSettings';

export class InfluenceCombination implements ICombination{

    IsMatching(context: CombinationContext): boolean { 
        return this.IsNormalMode(context) 
        && context.Items.length >=2 
        && context.Items[0] instanceof Ceil
        && context.Items[1] instanceof InfluenceMenuItem 
    }

    private IsNormalMode(context: CombinationContext) {
        return context.ContextMode === ContextMode.SingleSelection
            && context.InteractionKind === InteractionKind.Up;
    } 

    Combine(context: CombinationContext): boolean {
        if(this.IsMatching(context))
        {
            let ceil = <Ceil> context.Items[0];
            if(!isNullOrUndefined(ceil))
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    if(PlaygroundHelper.PlayerHeadquarter.HasMoney(GameSettings.FieldPrice))
                    {
                        PlaygroundHelper.PlayerHeadquarter.Buy(GameSettings.FieldPrice);
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:ceil.GetCoordinate(),
                            Type:"Influence"
                        });
                        let field = new InfluenceField(ceil,PlaygroundHelper.PlayerHeadquarter);
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