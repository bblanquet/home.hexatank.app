import { InteractionContext } from "../Context/InteractionContext";
import { Archive } from "../Tools/ResourceArchiver";
import { MenuItem } from "./MenuItem";
import { PlaygroundHelper } from "../PlaygroundHelper";

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