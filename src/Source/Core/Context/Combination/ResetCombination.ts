import { ICombination } from "./ICombination";
import { ResetButton } from "../../Menu/ResetButton";
import { Item } from "../../Items/Item";

export class ResetCombination implements ICombination{
    IsMatching(items: Item[]): boolean 
    {
        return items.filter(i=>i instanceof ResetButton).length > 0;
    }    

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            // let scale = PlaygroundHelper.Settings.GetScale()-0.1;
            // PlaygroundHelper.Settings.ChangeScale(scale);
             items.filter(i=>(i instanceof ResetButton)).forEach(element => {
                 items.splice(items.indexOf(element),1);
             });
            return true;
        }
        return false;
    }

    Clear(): void {
    }

}