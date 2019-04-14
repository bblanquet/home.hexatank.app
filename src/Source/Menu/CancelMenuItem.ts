import { InteractionContext } from "../Context/InteractionContext";
import { Archive } from "../Tools/ResourceArchiver";
import { SelectableMenuItem } from "./SelectableMenuItem";

export class CancelMenuItem extends SelectableMenuItem
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