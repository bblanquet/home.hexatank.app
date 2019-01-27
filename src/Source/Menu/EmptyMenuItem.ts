import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class EmptyMenuItem extends MenuItem
{
    constructor(a:string,b:string){
        super(a,b); 
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

}