import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class CancelMenuItem extends MenuItem
{
    constructor()
    { 
        super('cancelIcon','cancelIcon');
    }    
    public Select(context: InteractionContext): boolean 
    {
        context.OnSelect(this);
        return true;
    }

}