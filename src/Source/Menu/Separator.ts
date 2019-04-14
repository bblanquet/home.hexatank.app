import { MenuItem } from "./MenuItem";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class Separator extends MenuItem{

    constructor(){
        super();
        this.Z = 4; 
        this.GenerateSprite('separator');
        this.Hide();
        PlaygroundHelper.Render.Add(this);
    }
 
    public Show(): void {
        this.SetProperty('separator',e=>e.alpha = 1);
    }

    public Select(context: InteractionContext): boolean {
        return false; 
    }
}