import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { SpeedFieldMenuItem } from "../../Menu/Buttons/SpeedFieldMenuItem";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { FastField } from "../../Ceils/Field/FastField";
import { PeerHandler } from "../../../Menu/Network/Host/On/PeerHandler"; 
import { PacketKind } from "../../../Menu/Network/PacketKind";

export class FastCeilCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length >=2 
        && items[0] instanceof Ceil
        && items[1] instanceof SpeedFieldMenuItem 
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[0];
            if(!isNullOrUndefined(ceil))
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    if(PlaygroundHelper.PlayerHeadquarter.Diamonds >= PlaygroundHelper.Settings.FieldPrice){
                        PlaygroundHelper.PlayerHeadquarter.Diamonds -= PlaygroundHelper.Settings.FieldPrice;
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:ceil.GetCoordinate(),
                            Type:"Fast"
                        });
                        let field = new FastField(ceil);
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
    public Clear(): void {
    }
    
}