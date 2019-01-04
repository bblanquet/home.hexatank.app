import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { Sprite } from "pixi.js";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class BasicItem extends Item{

    
    constructor(private _boundingBox:BoundingBox, sprite:Sprite ){
        super();
        this.Z = 1;
        this.DisplayObjects.push(sprite);
        PlaygroundHelper.Render.Add(this);
    }


    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }    
    
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Destroy(): void 
    {
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this);
    }

}