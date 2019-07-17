import { SelectableMenuItem } from "./SelectableMenuItem";
import { InteractionContext } from "../Context/InteractionContext";
import { Archive } from "../Utils/ResourceArchiver";
 
export class MoneyMenuItem extends SelectableMenuItem{
    constructor(){
        super(Archive.menu.moneyButton); 
    }    

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this); 
        return true;
    }

}