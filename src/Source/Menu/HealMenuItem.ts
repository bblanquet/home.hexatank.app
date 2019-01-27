import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class HealMenuItem extends MenuItem{
    constructor(){
        super('healCeilIcon','healCeilIcon');
    }    

    public Select(context: InteractionContext): boolean {
        // context.SelectionEvent.on(this.SelectionFunc);
        context.OnSelect(this); 
        return true;
    }

}