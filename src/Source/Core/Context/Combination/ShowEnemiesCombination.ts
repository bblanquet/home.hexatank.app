import { ICombination } from "./ICombination";
import { ShowEnemiesMenuItem } from "../../Menu/ShowEnemiesMenuItem";
import { Item } from "../../Items/Item";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

export class ShowEnemiesCombination implements ICombination{
    IsMatching(items: Item[]): boolean 
    {
        return items.filter(i=>i instanceof ShowEnemiesMenuItem).length > 0; 
    }    

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            PlaygroundHelper.Settings.ShowEnemies =!PlaygroundHelper.Settings.ShowEnemies; 
            items.filter(i=>(i instanceof ShowEnemiesMenuItem)).forEach(element => {
                items.splice(items.indexOf(element),1);
            });
            return true;
        }
        return false;
    }

    Clear(): void {
    }
}