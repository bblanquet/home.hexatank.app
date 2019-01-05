import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";

export abstract class MenuItem extends Item
{
    BoundingBox:BoundingBox;
    IsSelected:boolean;

    constructor(unselected:string,selected:string){
        super();
        this.Z = 3;
        this.DisplayObjects.push( new PIXI.Sprite(PlaygroundHelper.Render.Textures[unselected]));
        this.DisplayObjects.push( new PIXI.Sprite(PlaygroundHelper.Render.Textures[selected]));
        this.IsSelected = false;
        this.DisplayObjects[0].alpha = 1;
        this.DisplayObjects[1].alpha = 0; 
        PlaygroundHelper.Render.Add(this);
    }

    public Hide(){
        this.DisplayObjects.forEach(item=>
            {item.alpha = 0;}
            );
    }

    public Show(){
        this.DisplayObjects.forEach(item=>
            {item.alpha =1;}
            );
    }

    protected Change():void
    {
        [this.DisplayObjects[0].alpha, this.DisplayObjects[1].alpha] = [this.DisplayObjects[1].alpha, this.DisplayObjects[0].alpha];
    }

    public SetBoundingBox(boundingbox:{x:number, y:number, width:number, height:number}):void{
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.X = boundingbox.x;
        this.BoundingBox.Y = boundingbox.y;
        this.BoundingBox.Width = boundingbox.width;
        this.BoundingBox.Height = boundingbox.height;
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        this.GetSprites().forEach(sprite=>{
            sprite.x = this.GetBoundingBox().X;
            sprite.y = this.GetBoundingBox().Y;
            sprite.width =this.GetBoundingBox().Width;
            sprite.height =this.GetBoundingBox().Height;
        });
    }

    public GetBoundingBox(): BoundingBox {
        return this.BoundingBox;
    }    
    
    public abstract Select(context: InteractionContext): boolean;
}