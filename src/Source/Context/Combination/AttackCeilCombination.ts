import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { Ceil } from "../../Ceil";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { AttackMenuItem } from "../../Menu/AttackMenuItem";
import { AttackField } from "../../Field/AttackField";
import { Headquarter } from "../../Field/Headquarter";

export class AttackCeilCombination implements ICombination{

    constructor(){
        
    }

    IsMatching(items: Item[]): boolean {
        return items.length >=3 
        && items[0] instanceof Headquarter
        && items[1] instanceof AttackMenuItem 
        && items[2] instanceof Ceil;
    }
    Combine(items: Item[]): void {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[2];
            if(!isNullOrUndefined(ceil))
            {
                let field = new AttackField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            items.splice(1,2);
        }
    }
    
}