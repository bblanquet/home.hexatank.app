import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";

export class SpeedFieldMenuItem extends MenuItem{
    
    constructor(){
        super('speedCeilIcon','speedCeilIcon');
    }

    public Select(context: InteractionContext): boolean {
        // context.SelectionEvent.on(this.SelectionFunc);
        context.OnSelect(this);
        return true;
    }

}