import { Archive } from "../Utils/ResourceArchiver";
import { InteractionContext } from "../Context/InteractionContext";
import { CheckableMenuItem } from "./CheckableMenuItem"; 

export class FlagMenuItem extends CheckableMenuItem{
    constructor(){
        super(Archive.menu.flagButton);
        this.Show();
    }

    public Select(context: InteractionContext): boolean      
    { 
        this.Swap();
        context.OnSelect(this);
        return true;
    }

}