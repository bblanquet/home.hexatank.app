import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class BasicItem extends Item{ 

    private _show:{ (): boolean };
    constructor(private _boundingBox:BoundingBox, sprite:Sprite ){
        super();
        this.Z = 0;
        this.DisplayObjects.push(sprite);
        PlaygroundHelper.Render.Add(this);
    }

    public Set(show:{ (): boolean }):void{
        this._show = show;
    }

    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }    
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number, zoom: number): void 
    {
        this.DisplayObjects.forEach(sprite=>{
            sprite.alpha = this._show() ? 1 :0; 
        });
        super.Update(viewX,viewY,zoom);    
    }
    Destroy(): void 
    {
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this);
    }

}