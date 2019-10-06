import { ICombination } from "./ICombination";
import { Item } from "../../Items/Item";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { PauseButton } from "../../Menu/Buttons/PauseButton";

export class PauseCombination implements ICombination{
    IsMatching(items: Item[]): boolean 
    {
        return items.filter(i=>i instanceof PauseButton).length > 0;
    }    

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            PlaygroundHelper.Settings.IsPause = !PlaygroundHelper.Settings.IsPause;
            items.filter(i=>(i instanceof PauseButton)).forEach(element => {
                items.splice(items.indexOf(element),1);
            });
            return true;
        }
        return false;
    }

    Clear(): void {
    }
}