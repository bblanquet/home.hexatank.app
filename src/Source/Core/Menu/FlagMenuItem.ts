import { Archive } from "../Utils/ResourceArchiver";
import { InteractionContext } from "../Context/InteractionContext";
import { CheckableMenuItem } from "./CheckableMenuItem"; 
import { PlaygroundHelper } from "../Utils/PlaygroundHelper";

export class FlagMenuItem extends CheckableMenuItem{
    constructor(){
        super(Archive.menu.flagButton);
        PlaygroundHelper.IsFlagingMode = false;
        this.Show();
    }

    public Select(context: InteractionContext): boolean      
    { 
        PlaygroundHelper.IsFlagingMode = !PlaygroundHelper.IsFlagingMode;
        this.Swap();
        return true;
    }

}