import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { TankMenuItem } from '../../Menu/Buttons/TankMenuItem';
import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";

export class AddTankCombination implements ICombination{

    IsMatching(items: Item[]): boolean {
        return items.length >=1
        && items[items.length-1] instanceof TankMenuItem 
    }

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items))
        {
            PlaygroundHelper.PlayerHeadquarter.AddTankRequest();
            items.splice(items.length-1,1);
            return true;
        }
        return false;
    }

    Clear(): void {
    }
    
}