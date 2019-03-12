import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class PatrolMenuItem extends MenuItem{

    constructor() 
    {
        super('patrolIcon','hoverPatrolIcon');
    }

    public Select(context: InteractionContext): boolean 
    {
       context.OnSelect(this);
       this.Swap();
       return true;
    }

} 