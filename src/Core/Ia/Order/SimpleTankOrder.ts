import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../../Ceils/Ceil";
import { isNull } from "util";
import { Tank } from "../../Items/Unit/Tank";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

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
            var target = targetCeil.GetShootableEntity();
            if(target.IsEnemy(this._tank)){
                this._tank.SetMainTarget(target);
            }
        } 
        else
        {
            return super.FindPath();
        }
        return true;
    }
}