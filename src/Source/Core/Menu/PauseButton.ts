import { InteractionContext } from "../Context/InteractionContext";
import { MenuItem } from "./MenuItem";
import { Archive } from "../Utils/ResourceArchiver";
import { PlaygroundHelper } from "../Utils/PlaygroundHelper";

export class PauseButton extends MenuItem{ 

    constructor(){
        super();
        this.Z = 6; 
        this.GenerateSprite(Archive.menu.pauseButton);
        PlaygroundHelper.Render.Add(this);
    }
    
    public Show(): void {
        this.SetProperty(Archive.menu.pauseButton,e=>e.alpha = 1);
    }    
    
    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

}