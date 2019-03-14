import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { SpeedFieldMenuItem } from "../../Menu/SpeedFieldMenuItem";
import { Ceil } from "../../Ceil";
import { FastField } from "../../Field/FastField";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { Headquarter } from "../../Field/Headquarter";
import { BasicField } from "../../Field/BasicField";

export class FastCeilCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length >=3 
        && items[0] instanceof Headquarter
        && items[1] instanceof SpeedFieldMenuItem 
        && items[2] instanceof Ceil;
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[2];
            if(!isNullOrUndefined(ceil))
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    let field = new FastField(ceil);
                    PlaygroundHelper.Playground.Items.push(field);
                }
            }
            items.splice(1,2);
            return true;
        }
        return false;
    }
    public Clear(): void {
    }
    
}