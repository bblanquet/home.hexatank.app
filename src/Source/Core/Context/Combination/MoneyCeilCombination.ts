import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { MoneyMenuItem } from "../../Menu/Buttons/MoneyMenuItem";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { MoneyField } from "../../Ceils/Field/MoneyField";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler";
import { PacketKind } from "../../../Menu/Network/PacketKind"; 

export class MoneyCeilCombination implements ICombination{

    IsMatching(items: Item[]): boolean { 
        return items.length >=2 
        && items[0] instanceof Ceil
        && items[1] instanceof MoneyMenuItem 
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
                            Type:"Money"
                        });
                        let field = new MoneyField(ceil);
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