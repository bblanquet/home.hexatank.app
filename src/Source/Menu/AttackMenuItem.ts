import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../InteractionContext";

export class AttackMenuItem extends MenuItem{
    public Select(context: InteractionContext): boolean {
        return false;
    }

}