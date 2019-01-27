import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { SpeedFieldMenuItem } from "../../Menu/SpeedFieldMenuItem";
import { Ceil } from "../../Ceil";
import { FastField } from "../../Field/FastField";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { Headquarter } from "../../Field/Headquarter";

export class FastCeilCombination implements ICombination{

    constructor(){
        
    }

    IsMatching(items: Item[]): boolean {
        return items.length >=3 
        && items[0] instanceof Headquarter
        && items[1] instanceof SpeedFieldMenuItem 
        && items[2] instanceof Ceil;
    }

    Combine(items: Item[]): void {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[2];
            if(!isNullOrUndefined(ceil))
            {
                let field = new FastField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            items.splice(1,2);
        }
    }
    
}