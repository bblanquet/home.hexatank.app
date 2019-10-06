import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver"; 
import { CheckableMenuItem } from "../CheckableMenuItem";

export class CancelMenuItem extends CheckableMenuItem 
{
    constructor()
    { 
        super(Archive.menu.cancelButton);
    }    
    public Select(context: InteractionContext): boolean 
    {
        context.OnSelect(this);
        return true;
    }

}