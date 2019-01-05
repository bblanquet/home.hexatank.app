import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";
import { Vehicle } from "../Vehicle";
import { Item } from "../Item";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class PatrolMenuItem extends MenuItem{

    constructor()
    {
        super('patrolIcon','hoverPatrolIcon');
    }

    public Select(context: InteractionContext): boolean 
    {
       context.OnSelect(this);
       return true;
    }

} 