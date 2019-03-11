import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class BasicItem extends Item{ 

    private _isVisible:{ (): boolean };
    private _isAlive:{ (): boolean };
    constructor(private _boundingBox:BoundingBox, sprite:Sprite ){
        super();
        this.Z = 0;
        sprite.alpha = 0;
        this.DisplayObjects.push(sprite);
    }

    public SetDisplayTrigger(show:{ (): boolean }):void{
        this._isVisible = show;
    }

    public SetVisible(show:{ (): boolean }):void{
        this._isAlive = show;
    }

    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }    
    
    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void 
    {
        if(!this._isAlive()){
            this.Destroy();
        }

        this.DisplayObjects.forEach(sprite=>{
            sprite.alpha = this._isVisible() ? 1 :0; 
        });
        super.Update(viewX,viewY);    
    }

    Destroy(): void 
    {
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this);
    }

}