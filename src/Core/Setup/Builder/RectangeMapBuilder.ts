import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Coordinates/HexAxial';
import { Cell } from '../../Cell/Cell';
import { CellProperties } from '../../Cell/CellProperties';

export class RectangleMapBuilder implements IPlaygroundBuilder<Cell>{

    public GetAreaMiddlecell(n:number):Array<HexAxial>{
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

    public Build(n:number): Cell[] {

        if(n < 2)
        {
            throw new Error();
        }
    
        if((n % 2) !== 0){
            throw new Error();
        }

        var cells = new Array<Cell>();

        for (let row = 0; row <= n; row++)
         {
            for (let column = 0; column <= n; column++) 
            {
                var hexAxial = new HexAxial(column,row);    
                var cell = new cell(new CellProperties(hexAxial));
                cells.push(cell);  
            }            
        }

        return cells;
    }
}