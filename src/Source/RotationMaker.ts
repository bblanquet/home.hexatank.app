import { IRotationMaker } from "./IRotationMaker";
import { IRotatable } from "./IRotatable";

export class RotationMaker<T extends IRotatable> implements IRotationMaker{
    private _movable:T;
    private _coeff:number;
    constructor(movable:T,coeff:number){
        this._movable = movable;
        this._coeff = coeff;
    }

    public Rotate():void
    {
        this._movable.CurrentRadius += (this._movable.CurrentRadius < this._movable.GoalRadius) ? this._coeff:-this._coeff;

        if(Math.abs(this._movable.CurrentRadius - this._movable.GoalRadius) < this._coeff)
        {
            this._movable.CurrentRadius = this._movable.GoalRadius;
        }
    }
}