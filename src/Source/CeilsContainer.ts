import {ICeil} from './ICeil';
import {HexAxial} from './Coordinates/HexAxial';

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
        return this.Ceils[coordinate.ToString()];
    }
}