import { Headquarter } from "../Field/Headquarter";
import { Vehicle } from "../Vehicle";
import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../Ceil";

export class HqFieldOrder extends SimpleOrder
{ 
    constructor(private _hq:Headquarter,private _vehicule:Vehicle){
        super(_hq.GetCeil(),_vehicule);
    }

    protected GetClosestCeil():Ceil{
        let ceils = this.GetCeils(this._hq);
        if(0 < ceils.length)
        {
            let ceil =  this.CeilFinder.GetCeil(ceils, this._vehicule);
            this.OriginalDest = ceil;
            return ceil;
        }
        else
        {
            return null;
        }
    }

    private GetCeils(hq:Headquarter):Array<Ceil>{
        return hq.GetCeil().GetNeighbourhood().map(c=><Ceil>c);
    }
}