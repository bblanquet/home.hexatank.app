import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { HealMenuItem } from "../../Menu/HealMenuItem";
import { Ceil } from "../../Ceil";
import { isNullOrUndefined } from "util";
import { HealField } from "../../Field/HealField";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { Headquarter } from "../../Field/Headquarter";
import { BasicField } from "../../Field/BasicField";

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
                    let field = new HealField(ceil);
                    PlaygroundHelper.Playground.Items.push(field);
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