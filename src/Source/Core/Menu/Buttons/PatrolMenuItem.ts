import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver"; 
import { CheckableMenuItem } from "../CheckableMenuItem"; 

export class PatrolMenuItem extends CheckableMenuItem{ 

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