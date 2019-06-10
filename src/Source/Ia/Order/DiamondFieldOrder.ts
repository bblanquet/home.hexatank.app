import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../../Ceil";
import { Vehicle } from "../../Unit/Vehicle";
import { Diamond } from "../../Field/Diamond"; 

export class DiamondFieldOrder extends SimpleOrder
{
    constructor(private _diamond:Diamond,private _vehicule:Vehicle){ 
        super(_diamond.GetCeil(),_vehicule);
    }
    
    protected GetClosestCeil():Ceil{
        let ceils = this.GetCeils(this._diamond);
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

    private GetCeils(hq:Diamond):Array<Ceil>{
        return hq.GetCeil().GetNeighbourhood().map(c=><Ceil>c);
    }
}