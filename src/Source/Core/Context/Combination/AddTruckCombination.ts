import { TruckMenuItem } from './../../Menu/TruckMenuItem';
import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";

export class AddTruckCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length >=1
        && items[items.length-1] instanceof TruckMenuItem
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            if(PlaygroundHelper.IsAddingMode())
            {
                PlaygroundHelper.PlayerHeadquarter.AddTruckRequest();
            }
            else
            {
                PlaygroundHelper.PlayerHeadquarter.RemoveTruckRequest();
            }
            items.splice(items.length-1,1);
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
}