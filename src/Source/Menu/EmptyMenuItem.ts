import { InteractionContext } from "../Context/InteractionContext";
import { MenuItem } from "./MenuItem";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class EmptyMenuItem extends MenuItem
{
    constructor(private _item:string){
        super(); 
        this.Z = 4; 
        this.GenerateSprite(_item);
        this.Hide();
        PlaygroundHelper.Render.Add(this);
    }

    public Show(): void {
        this.SetProperty(this._item,e=>e.alpha = 1);
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

}