import { InteractionContext } from "../Context/InteractionContext";
import { CheckableMenuItem } from "./CheckableMenuItem";
import { Archive } from "../Utils/ResourceArchiver";
 
export class HealMenuItem extends CheckableMenuItem{
    constructor(){
        super(Archive.menu.healthButton); 
    }    

    public Select(context: InteractionContext): boolean { 
        context.OnSelect(this); 
        return true;
    }
}