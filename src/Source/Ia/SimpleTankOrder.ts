import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../Ceil";
import { Tank } from "../Tank";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { isNull } from "util";

export class SimpleTankOrder extends SimpleOrder{
    private _tank:Tank;

    constructor(d:Ceil,v:Tank){
        super(d,v);
        this._tank = v;
    }

    protected FindPath():boolean
    {
        if(this.Dest.IsShootable())
        {
            let targetCeil = this.Dest;
            this.Dest = this.GetClosestCeil();
            if(isNull(this.Dest))
            {
                return false;
            }
            this.Ceils = PlaygroundHelper.Engine.GetPath(this._tank.GetCurrentCeil(), this.Dest);
            this._tank.SetMainTarget(targetCeil.GetShootableEntity());
        } 
        else
        {
            return super.FindPath();
        }
        return true;
    }
}