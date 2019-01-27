import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class AttackMenuItem extends MenuItem
{
    constructor(){
        super('attackCeilIcon','attackCeilIcon');
    }    

    public Select(context: InteractionContext): boolean {
        // context.SelectionEvent.on(this.SelectionFunc);
        context.OnSelect(this);
        return true;
    }

} 