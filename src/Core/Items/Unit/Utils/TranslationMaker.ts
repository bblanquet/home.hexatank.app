import { ITranslationMaker } from "./ITranslationMaker";
import { IMovable } from "../../IMovable"; 
import { ToolBox } from "./ToolBox";
import { IBoundingBoxContainer } from "../../../IBoundingBoxContainer";

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
        var nextcellBox = this._item.GetNextCell().GetBoundingBox();

        var xRatio = this.GetXRatio(itemBox.GetCentralPoint(),nextcellBox.GetCentralPoint());

        itemBox.Y += (nextcellBox.GetMiddle() < itemBox.GetMiddle()) 
        ? -this._item.TranslationSpeed:this._item.TranslationSpeed;
        itemBox.X += ((nextcellBox.GetCenter() < itemBox.GetCenter()) 
        ? -this._item.TranslationSpeed:this._item.TranslationSpeed)*xRatio;

        if(isNaN(itemBox.X)){
            throw `error speed ${this._item.TranslationSpeed}`;
        } 

        const currentMiddle = itemBox.GetMiddle();
        const nextMiddle = nextcellBox.GetMiddle();
        const currentCenter = itemBox.GetCenter();
        const nextCenter = nextcellBox.GetCenter();

        if(this.IsCloseEnough(currentCenter, nextCenter,this._item))
        {
            itemBox.X = nextcellBox.X;
        }

        if(this.IsCloseEnough(currentMiddle, nextMiddle,this._item))
        {
            itemBox.Y = nextcellBox.Y;
        }

        if(currentMiddle == nextMiddle && currentCenter == nextCenter)
        {
            this._item.MoveNextCell();
        }
    }

    public GetPercentageTranslation(): number {
        var fullDistance = ToolBox.GetDist(this._item.GetCurrentCell().GetCentralPoint(), this._item.GetNextCell().GetCentralPoint());
        var currentDistance = ToolBox.GetDist(this._item.GetBoundingBox().GetCentralPoint(), this._item.GetNextCell().GetCentralPoint());
        return (currentDistance / fullDistance) * 100;
    }
}

