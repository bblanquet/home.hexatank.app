import { SimpleOrder } from "./SimpleOrder";
import { isNull } from "util";
import { Tank } from "../../Items/Unit/Tank";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Cell } from "../../Cell/Cell";

export class SimpleTankOrder extends SimpleOrder{
    private _tank:Tank;

    constructor(d:Cell,v:Tank){
        super(d,v);
        this._tank = v;
    }
 
    protected FindPath():boolean
    {
        if(this.Dest.IsShootable())
        {
            let tarGetCell = this.Dest;
            this.Dest = this.GetClosestcell();
            if(isNull(this.Dest))
            {
                return false;
            }
            this.cells = PlaygroundHelper.Engine.GetPath(this._tank.GetCurrentCell(), this.Dest);
            var target = tarGetCell.GetShootableEntity();
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