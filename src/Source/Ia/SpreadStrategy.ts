import { Area } from "./AreaFinder/Area";
import { SmartHq } from "./SmartHq";
import { Point } from "../Point";

export class SpreadStrategy{

    constructor(private _hq:SmartHq){
        
    }

    public FindArea():Area
    {    
        if(this._hq.EmptyAreas.length === 0)
        {
            return null;
        }

        let currentArea = this._hq.EmptyAreas[0];
        let currentCost = this.GetCost(
            this._hq.GetCeil().GetCentralPoint(),
            currentArea.GetCentralCeil().GetCentralPoint()
        );

        this._hq.EmptyAreas.forEach(area => 
        {
            let cost = this.GetCost(
                this._hq.GetCeil().GetCentralPoint(),
                area.GetCentralCeil().GetCentralPoint()
            )
               if(cost < currentCost)
               {
                    currentArea = area;
                    currentCost = cost;
               }
        });

        this._hq.EmptyAreas.splice(this._hq.EmptyAreas.indexOf(currentArea),1);
        return currentArea;
    }

    private GetCost(a:Point,b:Point):number
    {
        return Math.sqrt(Math.pow(b.X - a.X,2)) 
            + Math.sqrt(Math.pow(b.Y - a.Y,2));
    }
}