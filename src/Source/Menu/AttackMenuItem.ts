import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class AttackMenuItem extends MenuItem{
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

} 