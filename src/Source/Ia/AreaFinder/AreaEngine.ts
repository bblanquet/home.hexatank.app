import { Ceil } from "../../Ceil";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { HexAxial } from "../../Coordinates/HexAxial";
import { isNullOrUndefined } from "util";

export class AreaEngine
{
    public GetAreas(ceil:Ceil):Array<Ceil>
    {
        var result = new Array<Ceil>();
        this.GetAllAreas(ceil,result);
        return result;
    }

    private GetAllAreas(currentCeil:Ceil,areas:Array<Ceil>):void
    {
        if(areas.filter(a=>a === currentCeil).length === 0)
        {
            areas.push(currentCeil);
            var neighs = this.GetNeighbourhoodAreas(currentCeil);
            neighs.forEach(neigh => {
                this.GetAllAreas(neigh,areas);
            });
        }
    }

    private GetNeighbourhoodAreas(ceil:Ceil):Array<Ceil>{
        var coo = ceil.GetCoordinate();
        var result = new Array<Ceil>();
        var shifts = [{Q:-3,R:0},{Q:0,R:-3},{Q:3,R:-3},{Q:3,R:0},{Q:0,R:3},{Q:3,R:-3}];
        
        shifts.forEach(shift => {
            let ngCeil = PlaygroundHelper.CeilsContainer.
            Get(new HexAxial(coo.Q + shift.Q,coo.R+shift.R));
            if(!isNullOrUndefined(ngCeil))
            {
                result.push(ngCeil);
            }
        });

        return result;
    }
}