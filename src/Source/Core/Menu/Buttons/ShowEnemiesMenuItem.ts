import { MenuItem } from "../MenuItem";
import { Archive } from "../../Utils/ResourceArchiver";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { InteractionContext } from "../../Context/InteractionContext";

export class ShowEnemiesMenuItem extends MenuItem{ 
    
    constructor(){
        super();
        this.Z = 6; 
        this.GenerateSprite(Archive.menu.showEnemies);
        PlaygroundHelper.Render.Add(this);
    }
    
    public Show(): void {
        this.SetProperty(Archive.menu.showEnemies,e=>e.alpha = 1);
    }    
    
    public Select(context: InteractionContext): boolean {
        context.OnSelect(this);
        return true;
    }

}