import { InteractionContext } from "../Context/InteractionContext";
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Tools/ResourceArchiver";

export class SpeedFieldMenuItem extends SelectableMenuItem{
    
    constructor(){
        super(Archive.menu.speedMenu);
    } 

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

}