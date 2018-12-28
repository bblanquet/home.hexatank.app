import { IAngleFinder } from "./IAngleFinder";
import { IBoundingBoxContainer } from "./IBoundingBoxContainer";
import { IRotatable } from "./IRotatable";

export class AngleFinder<T extends IRotatable & IBoundingBoxContainer> implements IAngleFinder{
    private _item:T;

    constructor(item:T)
    { 
        this._item = item;
    }

    public SetAngle(ceil:IBoundingBoxContainer):void
    {
        var aPoint = new PIXI.Point(this._item.GetBoundingBox().GetCenter(),this._item.GetBoundingBox().GetMiddle());
        var bPoint = new PIXI.Point(this._item.GetBoundingBox().GetCenter(),this._item.GetBoundingBox().GetMiddle() + 1);
        var cPoint = new PIXI.Point(ceil.GetBoundingBox().GetCenter(), ceil.GetBoundingBox().GetMiddle());

        this._item.GoalRadius = Math.atan2(cPoint.y - bPoint.y, cPoint.x - bPoint.x) - Math.atan2(aPoint.y - bPoint.y, aPoint.x - bPoint.x);

        if((((2*Math.PI) - this._item.GoalRadius) + this._item.CurrentRadius) < Math.abs(this._item.GoalRadius - this._item.CurrentRadius))
        {
            this._item.GoalRadius = this._item.GoalRadius -(2*Math.PI); 
        }
    };

}