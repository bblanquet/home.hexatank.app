import { BoundingBox } from "../BoundingBox";
import { MenuItem } from "./MenuItem";
import { Archive } from "../Tools/ResourceArchiver";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { InteractionContext } from "../Context/InteractionContext";
import { isNullOrUndefined } from "util";

export abstract class SelectableMenuItem extends MenuItem
{
    BoundingBox:BoundingBox;
    _isSelected:boolean=false;
    constructor(private _icon:string){
        super();
        this.Z = 6; 
        this.GenerateSprite(Archive.menu.backgroundButton);
        this.GenerateSprite(Archive.menu.hoverBackgroundButton);
        this.GenerateSprite(this._icon);
        this.Hide();
        PlaygroundHelper.Render.Add(this);
    }

    public Hide(){
        this.GetSprites().forEach(item=>
            {item.alpha = 0;}
            );
    }

    public Show(){
        this.SetProperties([Archive.menu.backgroundButton,this._icon],e=>e.alpha = 1);
    }

    protected Swap():void
    {
        if(this._isSelected){
            this.SetProperties([Archive.menu.hoverBackgroundButton],e=>e.alpha = 0);
            this.SetProperties([Archive.menu.backgroundButton],e=>e.alpha = 1);
        }else
        {
            this.SetProperties([Archive.menu.hoverBackgroundButton],e=>e.alpha = 1);
            this.SetProperties([Archive.menu.backgroundButton],e=>e.alpha = 0);
        }
        this._isSelected = !this._isSelected;
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