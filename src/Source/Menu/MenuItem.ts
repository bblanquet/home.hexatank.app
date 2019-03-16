import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { isNullOrUndefined } from "util";

export abstract class MenuItem extends Item
{
    BoundingBox:BoundingBox;
    IsSelected:boolean;
    
    constructor(private _unselected:string,private _selected:string){
        super();
        this.Z = 4; 
        this.GenerateSprite(this._unselected);
        this.GenerateSprite(this._selected);
        this.IsSelected = false;
        this.SetDefault();
        PlaygroundHelper.Render.Add(this);
    }

    public Hide(){
        this.GetSprites().forEach(item=>
            {item.alpha = 0;}
            );
    }

    public Show(){
        this.SetProperty(this._unselected,e=>e.alpha = 1);
    }

    protected SetDefault():void{
        this.SetProperty(this._unselected,e=>e.alpha = 1);
        this.SetProperty(this._selected,e=>e.alpha = 0);
    }

    protected Swap():void
    {
        if(this.GetBothSprites(this._unselected)[0].alpha === 1){
            this.SetProperty(this._unselected,e=>e.alpha = 0); 
            this.SetProperty(this._selected,e=>e.alpha = 1);

        }else{
            this.SetProperty(this._unselected,e=>e.alpha = 1);
            this.SetProperty(this._selected,e=>e.alpha = 0);
        }
    }

    public SetBoundingBox(boundingbox:{x:number, y:number, width:number, height:number}):void{
        if(isNullOrUndefined(this.BoundingBox))
        {
            this.BoundingBox = new BoundingBox();
        }
        this.BoundingBox.X = boundingbox.x;
        this.BoundingBox.Y = boundingbox.y;
        this.BoundingBox.Width = boundingbox.width;
        this.BoundingBox.Height = boundingbox.height;
    }

    public Update(viewX: number, viewY: number): void {
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