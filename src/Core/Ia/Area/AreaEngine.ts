import { ICeil } from '../../Ceils/ICeil';
import { HexAxial } from "../../Utils/Coordinates/HexAxial";
import { isNullOrUndefined } from "util"; 
import { CeilsContainer } from "../../Ceils/CeilsContainer"; 

export class AreaEngine<T extends ICeil> 
{
    public GetAreas(ceils:CeilsContainer<T>,ceil:T):Array<T>
    {
        var result = new Array<T>();
        this.GetAllAreas(ceils,ceil,result);
        return result;
    }

    private GetAllAreas(ceils:CeilsContainer<T>, currentCeil:T,areas:Array<T>):void
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

    public GetNeighbourhoodAreas(ceils:CeilsContainer<T>, ceil:T):Array<T>{
        var coo = ceil.GetCoordinate();
        var result = new Array<T>();
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

    public GetFirstRange(container:CeilsContainer<T>,ceil:T):Array<T>{
        let innerCircle = this.GetNeighbourhoodAreas(container, ceil);
        innerCircle.push(ceil)
        return innerCircle;
    }


    public GetSecondRangeAreas(container:CeilsContainer<T>,ceil:T):Array<T>{
        let outerCircle = new Array<T>();
        let innerCircle = this.GetNeighbourhoodAreas(container, ceil);
        
        innerCircle.forEach(innerCeil => {
            this.GetNeighbourhoodAreas(container, innerCeil).forEach(outCeil =>{
                outerCircle.push(outCeil);
            });
        });

        return outerCircle.filter(v=> innerCircle.indexOf(v) === -1);
    }
}