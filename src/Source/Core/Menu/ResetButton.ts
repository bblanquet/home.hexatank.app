import { InteractionContext } from "../Context/InteractionContext";
import { MenuItem } from "./MenuItem";
import { Archive } from "../Utils/ResourceArchiver";
import { PlaygroundHelper } from "../Utils/PlaygroundHelper"; 

export class ResetButton extends MenuItem{
    constructor(){
        super();
        this.Z = 6; 
        this.GenerateSprite(Archive.menu.resetButton);
        PlaygroundHelper.Render.Add(this);
    }
    
    public Show(): void {
        this.SetProperty(Archive.menu.resetButton,e=>e.alpha = 1);
    }    
    
    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

}