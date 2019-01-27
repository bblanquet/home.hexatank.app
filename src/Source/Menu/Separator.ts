import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class Separator extends MenuItem{
    constructor(){
        super('separator','separator');
    }
 
    public Select(context: InteractionContext): boolean {
        return false; 
    }
}