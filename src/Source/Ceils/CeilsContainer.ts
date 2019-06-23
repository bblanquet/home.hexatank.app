import {ICeil} from './ICeil'; 
import {HexAxial} from '../Coordinates/HexAxial';

export class CeilsContainer<T extends ICeil> {
    private Ceils:{ [id: string]: T; };

    Add(ceil:T):void{
        
        if(this.Ceils == null)
        {
            this.Ceils = {};
        }
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