import { Ceil } from "../../Ceil";
import { HexAxial } from "../../Coordinates/HexAxial";
import { isNullOrUndefined } from "util";
import { CeilsContainer } from "../../CeilsContainer";

export class AreaEngine
{
    public GetAreas(ceils:CeilsContainer<Ceil>,ceil:Ceil):Array<Ceil>
    {
        var result = new Array<Ceil>();
        this.GetAllAreas(ceils,ceil,result);
        return result;
    }

    private GetAllAreas(ceils:CeilsContainer<Ceil>, currentCeil:Ceil,areas:Array<Ceil>):void
    {
        if(areas.filter(a=>a === currentCeil).length === 0)
        {
            areas.push(currentCeil);
            var neighs = this.GetNeighbourhoodAreas(ceils, currentCeil);
            neighs.forEach(neigh => {
                this.GetAllAreas(ceils,neigh,areas);
            }); 
        }
    }

    private GetNeighbourhoodAreas(ceils:CeilsContainer<Ceil>, ceil:Ceil):Array<Ceil>{
        var coo = ceil.GetCoordinate();
        var result = new Array<Ceil>();
        var shifts = [{Q:-1,R:-2},{Q:2,R:-3},{Q:3,R:-1},{Q:1,R:2},{Q:-2,R:3},{Q:-3,R:1}];
        
        shifts.forEach(shift => {
            let ngCeil = ceils.
            Get(new HexAxial(coo.Q + shift.Q,coo.R+shift.R));
            if(!isNullOrUndefined(ngCeil))
            {
                result.push(ngCeil);
            }
        });

        return result;
    }
}