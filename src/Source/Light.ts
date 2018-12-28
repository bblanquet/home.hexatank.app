import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Sprite } from "pixi.js";

export class Light extends Item{
    BoundingBox:BoundingBox;
    IsShowing:boolean;
    Size:number;
    constructor(){
        super();
        this.Z= 3;
        this.BoundingBox = new BoundingBox();
        this.GetBoundingBox().Width = 10;
        this.GetBoundingBox().Height = 10;
        var sprite = new Sprite(PlaygroundHelper.Render.Textures["diamondLight.png"]);
        this.DisplayObjects.push(sprite);
        PlaygroundHelper.Render.Add(this);
    }

    public GetBoundingBox(): BoundingBox{
        return this.BoundingBox;
    }
    
    public Display(x:number,y:number):void{
        this.IsShowing = true;
        this.DisplayObjects[0].alpha = 1;
        this.GetBoundingBox().X = x;
        this.GetBoundingBox().Y = y;
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        super.Update(viewX,viewY,zoom);
        
        if(this.IsShowing)
        {
            this.DisplayObjects[0].alpha -= 0.01;
            
            
            if(this.DisplayObjects[0].alpha <= 0)
            {
                this.IsShowing = false;
            }
        }
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }
}