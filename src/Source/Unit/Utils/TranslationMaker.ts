import { ITranslationMaker } from "./ITranslationMaker";
import { IMovable } from "../../IMovable"; 
import { IBoundingBoxContainer } from "../../IBoundingBoxContainer";

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker
{
    private _item:T;

    constructor(item:T){
        this._item = item;
    }

    private static GetDiff(a:number,b:number):number{
        if(a < b){
            [b,a] = [a,b];
        }
        return Math.abs(b - a);
    }
    private IsCloseEnough(a:number,b:number,_item:T):boolean{
        if(a < b){
            [b,a] = [a,b];
        }

        return Math.abs(b - a) <_item.TranslationSpeed;
    }

    private GetXRatio(current: {X: number, Y: number}, target: {X: number, Y: number}):number
    {
        var distanceX = TranslationMaker.GetDiff(target.X,current.X);
        var distanceY = TranslationMaker.GetDiff(target.Y,current.Y);
        if(distanceY <= 0.01)
        {
            return distanceX;
        }
        return distanceX/distanceY;
    }
    
    public Translate():void
    {
        var itemBox = this._item.GetBoundingBox();
        var nextCeilBox = this._item.GetNextCeil().GetBoundingBox();

        var xRatio = this.GetXRatio(itemBox.GetCentralPoint(),nextCeilBox.GetCentralPoint());

        itemBox.Y += (nextCeilBox.GetMiddle() < itemBox.GetMiddle()) 
        ? -this._item.TranslationSpeed:this._item.TranslationSpeed;
        itemBox.X += ((nextCeilBox.GetCenter() < itemBox.GetCenter()) 
        ? -this._item.TranslationSpeed:this._item.TranslationSpeed)*xRatio;

        if(isNaN(itemBox.X)){
            throw `error speed ${this._item.TranslationSpeed}`;
        } 

        const currentMiddle = itemBox.GetMiddle();
        const nextMiddle = nextCeilBox.GetMiddle();
        const currentCenter = itemBox.GetCenter();
        const nextCenter = nextCeilBox.GetCenter();

        if(this.IsCloseEnough(currentCenter, nextCenter,this._item))
        {
            itemBox.X = nextCeilBox.X;
        }

        if(this.IsCloseEnough(currentMiddle, nextMiddle,this._item))
        {
            itemBox.Y = nextCeilBox.Y;
        }

        if(currentMiddle == nextMiddle && currentCenter == nextCenter)
        {
            this._item.MoveNextCeil();
        }
    }
}

