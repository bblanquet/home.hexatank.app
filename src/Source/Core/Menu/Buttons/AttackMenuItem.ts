import { InteractionContext } from "../../Context/InteractionContext";
import { CheckableMenuItem } from "../CheckableMenuItem"; 
import { Archive } from "../../Utils/ResourceArchiver";

export class AttackMenuItem extends CheckableMenuItem 
{
    constructor(){
        super(Archive.menu.powerButton); 
    }    

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

} 