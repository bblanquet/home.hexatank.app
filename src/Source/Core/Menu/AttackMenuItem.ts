import { InteractionContext } from "../Context/InteractionContext";
import { SelectableMenuItem } from "./SelectableMenuItem";
import { Archive } from "../Utils/ResourceArchiver";

export class AttackMenuItem extends SelectableMenuItem 
{
    constructor(){
        super(Archive.menu.powerButton);
    }    

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

} 