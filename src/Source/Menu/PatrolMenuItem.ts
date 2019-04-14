import { InteractionContext } from "../Context/InteractionContext";
import { Archive } from "../Tools/ResourceArchiver";
import { SelectableMenuItem } from "./SelectableMenuItem"; 

export class PatrolMenuItem extends SelectableMenuItem{

    constructor() 
    {
        super(Archive.menu.patrolButton);
    }

    public Select(context: InteractionContext): boolean 
    {
       context.OnSelect(this);
       this.Swap();
       return true;
    }

} 