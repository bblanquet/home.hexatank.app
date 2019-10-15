import {ICeil} from './ICeil'; 
import {HexAxial} from '../Utils/Coordinates/HexAxial';

export class CeilsContainer<T extends ICeil> {
    private Ceils:{ [id: string]: T; } = {}; 

    GetAll():T[]{
        var all = new Array<T>();
        for(var key in this.Ceils){
            all.push(<T><unknown>this.Ceils[key]);
        }
        return all;
    }

    Add(ceil:T):void{
        this.Ceils[ceil.GetCoordinate().ToString()] = ceil; 
    }

    Get(coordinate:HexAxial):T{
        if(coordinate.ToString() in this.Ceils)
        {
            return this.Ceils[coordinate.ToString()];
        }
        else
        {
            return null;
        }
    }

    public GetNeighbourhood(coordinate:HexAxial):Array<ICeil>{
        var ceils = new Array<ICeil>();
        coordinate.GetNeighbours().forEach(coordinate => {
            var ceil = this.Get(coordinate);
            if(ceil != null)
            {
                ceils.push(ceil);
            }
        });
        return ceils;
    }
}