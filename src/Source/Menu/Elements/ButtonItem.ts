import { Item } from "../../Core/Items/Item";
import { BoundingBox } from "../../Core/Utils/BoundingBox";
import { InteractionContext } from "../../Core/Context/InteractionContext";
import { isNullOrUndefined } from "util";

export class ButtonItem extends Item{

    private _text:string;
    private _color:number;
    BoundingBox:BoundingBox;

    constructor(text:string, color:number){
        super();
        this._text = text;
        this._color = color;
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

    public GetBoundingBox(): BoundingBox {
        return this.BoundingBox;
    }

    public Select(context: InteractionContext): boolean {
        context.OnSelect(this); 
        return true;
    }


}