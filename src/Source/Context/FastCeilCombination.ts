import { ICombination } from "./ICombination";
import { Item } from "../Item";
import { SpeedFieldMenuItem } from "../Menu/SpeedFieldMenuItem";
import { Ceil } from "../Ceil";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { FastField } from "../FastField";
import { isNullOrUndefined } from "util";

export class FastCeilCombination implements ICombination{

    constructor(){
        
    }

    IsMatching(items: Item[]): boolean {
        return items.length >=2 
        && items[0] instanceof SpeedFieldMenuItem 
        && items[1] instanceof Ceil
    }
    Combine(items: Item[]): void {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[1];
            if(!isNullOrUndefined(ceil))
            {
                let field = new FastField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            items.splice(0,2);
        }
    }
    
}