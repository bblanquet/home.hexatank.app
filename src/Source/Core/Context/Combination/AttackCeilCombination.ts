import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { AttackMenuItem } from "../../Menu/AttackMenuItem";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { BasicField } from "../../Ceils/Field/BasicField";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { AttackField } from "../../Ceils/Field/AttackField";

export class AttackCeilCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length >=2 
        && items[0] instanceof Ceil
        && items[1] instanceof AttackMenuItem 
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
                        let field = new AttackField(ceil);
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