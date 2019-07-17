import { InteractionContext } from "../Context/InteractionContext";
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Utils/ResourceArchiver";
 
export class HealMenuItem extends SelectableMenuItem{
    constructor(){
        super(Archive.menu.healthButton);
    }    

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this); 
        return true;
    }

}