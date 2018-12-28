import { ITranslationMaker } from "./ITranslationMaker";
import { IMovable } from "./IMovable";
import { IBoundingBoxContainer } from "./IBoundingBoxContainer";

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
    private static IsCloseEnough(a:number,b:number):boolean{
        if(a < b){
            [b,a] = [a,b];
        }

        return Math.abs(b - a) < 1;
    }

    private GetXRatio(current: {X: number, Y: number}, target: {X: number, Y: number}):number
    {
        var distanceX = TranslationMaker.GetDiff(target.X,current.X);
        var distanceY = TranslationMaker.GetDiff(target.Y,current.Y);
        return distanceX/distanceY;
    }
    
    public Translate():void
    {
        var itemBox = this._item.GetBoundingBox();
        var nextCeilBox = this._item.CurrentNextCeil.GetBoundingBox();

        var xRatio = this.GetXRatio(itemBox.GetCentralPoint(),nextCeilBox.GetCentralPoint());

        itemBox.Y += (nextCeilBox.GetMiddle() < itemBox.GetMiddle()) ? -1:1;
        itemBox.X += (nextCeilBox.GetCenter() < itemBox.GetCenter()) ? -1*xRatio:1*xRatio;

        if(TranslationMaker.IsCloseEnough(itemBox.GetCenter(), nextCeilBox.GetCenter()))
        {
            itemBox.X = nextCeilBox.X;
        }

        if(TranslationMaker.IsCloseEnough(itemBox.GetMiddle(), nextCeilBox.GetMiddle()))
        {
            itemBox.Y = nextCeilBox.Y;
        }

        if(itemBox.GetMiddle() == nextCeilBox.GetMiddle() 
        && itemBox.GetCenter() == nextCeilBox.GetCenter())
        {
            this._item.CurrentCeil.SetMovable(null);
            this._item.CurrentCeil = this._item.CurrentNextCeil;
            this._item.CurrentCeil.SetMovable(this._item);
            this._item.CurrentNextCeil = null;
        }
    }
}