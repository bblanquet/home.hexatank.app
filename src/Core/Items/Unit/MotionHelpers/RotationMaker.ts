import { IRotationMaker } from "./IRotationMaker";
import { IRotatable } from "./IRotatable";

export class RotationMaker<T extends IRotatable> implements IRotationMaker{
    private _movable:T;

    constructor(movable:T){
        this._movable = movable;
    }

    public Rotate():void
    {
        this._movable.CurrentRadius += (this._movable.CurrentRadius < this._movable.GoalRadius) ? this._movable.RotationSpeed:-this._movable.RotationSpeed;

        if(Math.abs(this._movable.CurrentRadius - this._movable.GoalRadius) < this._movable.RotationSpeed)
        {
            this._movable.CurrentRadius = this._movable.GoalRadius;
        }
    }
}