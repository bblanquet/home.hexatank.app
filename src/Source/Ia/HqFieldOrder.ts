import { Headquarter } from "../Field/Headquarter";
import { Vehicle } from "../Vehicle";
import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../Ceil";

export class HqFieldOrder extends SimpleOrder
{ 
    constructor(private _hq:Headquarter,private _vehicule:Vehicle){
        super(<Ceil>_hq.GetCeil().GetNeighbourhood()[0],_vehicule);
    }

    protected GetClosestCeil():Ceil{
        let ceils = this.GetCeils(this._hq);
        if(0 === this.Dest.GetAllNeighbourhood().filter(c=> c === this._vehicule.GetCurrentCeil()).length)
        {
            if(ceils.length === 0)
            {
                return null;
            }
            else
            {
                return this.CeilFinder.GetCeil(ceils, this._vehicule);
            }
        }
        else
        {
            return this._vehicule.GetCurrentCeil();
        }
    }

    private GetCeils(hq:Headquarter):Array<Ceil>{
        return hq.GetCeil().GetNeighbourhood().map(c=><Ceil>c);
    }
}