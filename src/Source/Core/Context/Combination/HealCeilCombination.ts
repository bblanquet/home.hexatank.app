import { ICombination } from "./ICombination";
import { HealMenuItem } from "../../Menu/Buttons/HealMenuItem";
import { isNullOrUndefined } from "util";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { HealField } from "../../Ceils/Field/HealField";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind"; 

export class HealCeilCombination implements ICombination 
{

    public IsMatching(items: Item[]): boolean {
        return items.length >=2
        && items[0] instanceof Ceil
        && items[1] instanceof HealMenuItem 
    }    
    
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[0];
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
            items.splice(0,2);
            ceil.SetSelected(false);
            return true;
        }
        return false;
    }
    Clear(): void {
    } 
}