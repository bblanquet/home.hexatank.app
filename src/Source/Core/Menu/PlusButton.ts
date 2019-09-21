import { PlaygroundHelper } from './../Utils/PlaygroundHelper';
import { CheckableMenuItem } from "./CheckableMenuItem"; 
import { Archive } from '../Utils/ResourceArchiver';
import { InteractionContext } from "../Context/InteractionContext";

export class PlusButton extends CheckableMenuItem{
    
    private _set:{(b:boolean):void}
    constructor(){
        super(Archive.menu.plusButton);
        this._set = this.Set.bind(this);
        PlaygroundHelper.SubscribeAdding(this._set);
        this.Show();  
        PlaygroundHelper.SetAddingMode(true);      
    }    

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.UnSubscribeAdding(this._set);
    }

    public Set(mode:boolean):void{
        if(mode)
        {
            this.SetSelected();
        }
        else
        {
            this.SetUnselected();
        }
    }

    public Select(context: InteractionContext): boolean {
        PlaygroundHelper.SetAddingMode(true);        
        return true;
    }
}