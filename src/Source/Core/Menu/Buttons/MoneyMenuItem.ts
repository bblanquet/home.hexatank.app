import { CheckableMenuItem } from "../CheckableMenuItem";
import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver"; 
 
export class MoneyMenuItem extends CheckableMenuItem{ 
    constructor(){
        super(Archive.menu.moneyButton); 
    }    

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this); 
        return true;
    }

}