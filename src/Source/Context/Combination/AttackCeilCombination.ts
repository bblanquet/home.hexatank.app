import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Ceil } from "../../Ceil";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { AttackMenuItem } from "../../Menu/AttackMenuItem";
import { AttackField } from "../../Field/AttackField";
import { Headquarter } from "../../Field/Headquarter";
import { BasicField } from "../../Field/BasicField";

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
                    let field = new AttackField(ceil);
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