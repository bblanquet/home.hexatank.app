import { Ceil } from "./Ceil"; 
import { Vehicle } from "../Unit/Vehicle";
import { Point } from "../Point";

export class CeilFinder{
    public GetCeil(ceils:Array<Ceil>,vehcile:Vehicle):Ceil
    {
        let min = this.GetCost(ceils[0].GetBoundingBox().GetCentralPoint(),vehcile.GetBoundingBox().GetCentralPoint()); 
        let selectedCeil = ceils[0];
        ceils.filter(c=>!c.IsBlocked()).forEach(ceil => 
        {
            var m = this.GetCost(ceil.GetBoundingBox().GetCentralPoint(),vehcile.GetBoundingBox().GetCentralPoint());
            if(m < min){
                min = m; 
                selectedCeil = ceil;
            }
        });    
        return selectedCeil;
    }

    private GetCost(a:Point,b:Point):number
    {
        return Math.sqrt(Math.pow(b.X - a.X,2)) 
            + Math.sqrt(Math.pow(b.Y - a.Y,2));
    }
}