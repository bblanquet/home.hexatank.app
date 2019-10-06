import { CheckableMenuItem } from "../CheckableMenuItem";
import { Archive } from '../../Utils/ResourceArchiver';
import { InteractionContext } from "../../Context/InteractionContext";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";  

export class MinusButton extends CheckableMenuItem{
    private _set:{(b:boolean):void}

    constructor(){
        super(Archive.menu.minButton);
        this._set = this.Set.bind(this);
        PlaygroundHelper.SubscribeAdding(this._set);
        this.Show();
    }    

    public Set(mode:boolean):void{
        if(!mode)
        {
            this.SetSelected();
        }
        else
        {
            this.SetUnselected();
        }
    }

    public Select(context: InteractionContext): boolean {
        PlaygroundHelper.SetAddingMode(false);        
        return true;
    }
}