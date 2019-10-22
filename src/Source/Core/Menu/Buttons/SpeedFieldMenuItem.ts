import { InteractionContext } from "../../Context/InteractionContext";
import { CheckableMenuItem } from "../CheckableMenuItem";
import { Archive } from "../../Utils/ResourceArchiver";  

export class SpeedFieldMenuItem extends CheckableMenuItem{ 
    
    constructor(){  
        super(Archive.menu.speedMenu);
    } 

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

}