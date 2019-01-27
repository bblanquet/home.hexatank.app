import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../Ceil";
import { Vehicle } from "../Vehicle";
import { Diamond } from "../Field/Diamond";

export class DiamondFieldOrder extends SimpleOrder
{
    constructor(private _diamond:Diamond,private _vehicule:Vehicle){
        super(<Ceil>_diamond.GetCeil().GetNeighbourhood()[0],_vehicule);
    }

    protected GetClosestCeil():Ceil{
        let ceils = this.GetCeils(this._diamond);
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

    private GetCeils(hq:Diamond):Array<Ceil>{
        return hq.GetCeil().GetNeighbourhood().map(c=><Ceil>c);
    }
}