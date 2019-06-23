import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../Coordinates/HexAxial';
import {Ceil} from '../Ceils/Ceil';
import { CeilProperties } from '../Ceils/CeilProperties';

export class RectangleMapBuilder implements IPlaygroundBuilder<Ceil>{

    public GetAreaMiddleCeil(n:number):Array<HexAxial>{
        return [
            new HexAxial(1,n/2),
            new HexAxial(n-1,n/2),//column,row
            new HexAxial(n/2,1),
            new HexAxial(n-1,1),
            new HexAxial(1,n-1),
            new HexAxial(n/2,n-1), 
        ]
    }

    public GetMidle(n:number):HexAxial{
        return new HexAxial(n/2,n/2);
    }

    public Build(n:number): Ceil[] {

        if(n < 2)
        {
            throw new Error();
        }
    
        if((n % 2) !== 0){
            throw new Error();
        }

        var ceils = new Array<Ceil>();

        for (let row = 0; row <= n; row++)
         {
            for (let column = 0; column <= n; column++) 
            {
                var hexAxial = new HexAxial(column,row);    
                var ceil = new Ceil(new CeilProperties(hexAxial));
                ceils.push(ceil);  
            }            
        }

        return ceils;
    }
}