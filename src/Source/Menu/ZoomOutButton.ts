import { InteractionContext } from "../Context/InteractionContext";
import { MenuItem } from "./MenuItem";
import { Archive } from "../Tools/ResourceArchiver";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class ZoomOutButton extends MenuItem{
    constructor(){
        super();
        this.Z = 4; 
        this.GenerateSprite(Archive.menu.zoomOutButton);
        PlaygroundHelper.Render.Add(this);
    }
    
    public Show(): void {
        this.SetProperty(Archive.menu.zoomOutButton,e=>e.alpha = 1);
    }    
    
    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

}