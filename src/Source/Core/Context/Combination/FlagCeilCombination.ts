import { FlagMenuItem } from './../../Menu/FlagMenuItem';
import { isNullOrUndefined } from "util";
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";
import { Ceil } from "../../Ceils/Ceil";
import { FlagCeil } from '../../Ceils/FlagCeil';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';

export class FlagCeilCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length ===1 
        && items[0] instanceof Ceil;
    }
    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            let ceil = <Ceil> items[0];
            if(!isNullOrUndefined(ceil) && PlaygroundHelper.IsFlagingMode)
            {
                if(!PlaygroundHelper.PlayerHeadquarter.FlagCeil)
                {
                    PlaygroundHelper.PlayerHeadquarter.FlagCeil = new FlagCeil(ceil);
                    PlaygroundHelper.Playground.Items.push(PlaygroundHelper.PlayerHeadquarter.FlagCeil);                    
                }
                else
                {
                    PlaygroundHelper.PlayerHeadquarter.FlagCeil.SetCeil(ceil);
                }
            }
        }
        return false;
    }

    Clear(): void {
    }
    
}