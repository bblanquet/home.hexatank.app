import { InteractionContext } from "../Context/InteractionContext";
import { Archive } from "../Utils/ResourceArchiver";
import { SelectableMenuItem } from "./SelectableMenuItem";

export class TargetMenuItem extends SelectableMenuItem{ 

    constructor() 
    { 
        super(Archive.menu.targetButton);
    }

    public Select(context: InteractionContext): boolean 
    {
       context.OnSelect(this);
       this.Swap();
       return true;
    }

} 