import { ICombination } from "./ICombination";
import { Item } from "../../Item";
import { ZoomInButton } from "../../Menu/ZoomInButton";
import { PlaygroundHelper } from "../../PlaygroundHelper";

export class ZoomInCombination implements ICombination{
    IsMatching(items: Item[]): boolean 
    {
        return items.filter(i=>i instanceof ZoomInButton).length > 0;
    }    

    Combine(items: Item[]): boolean {
        if(this.IsMatching(items)){
            // let scale = PlaygroundHelper.Settings.GetScale()+0.1;
            // PlaygroundHelper.Settings.ChangeScale(scale);
            // items.filter(i=>(i instanceof ZoomInButton)).forEach(element => {
            //     items.splice(items.indexOf(element),1);
            // });
            return true;
        }
        return false;
    }

    Clear(): void {
    }
}