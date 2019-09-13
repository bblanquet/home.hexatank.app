import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Coordinates/HexAxial';
import { CeilProperties } from '../../Ceils/CeilProperties';

export class SpecHexagonalMapBuilder implements IPlaygroundBuilder<CeilProperties>{
    GetMidle(n: number): HexAxial {
        throw new Error("Method not implemented.");  
    }
    GetAreaMiddleCeil(n: number): HexAxial[] {
        throw new Error("Method not implemented.");
    }

    Build(edgeSize:number): CeilProperties[] { 
        if(edgeSize < 2)
        {
            throw new Error();
        }
    
        if(edgeSize % 2 != 0){
            throw new Error();
        }

        var ceils = new Array<CeilProperties>();

        var doubleEdgeSize = Math.round(edgeSize*2);
        var row = -1;
        for(row = -1; row < doubleEdgeSize ; row++){

            var startColumn = 0;
            var endColumn = Math.round(edgeSize*2);
    
            if(row < edgeSize-1)
            {
                startColumn = Math.round(edgeSize - (row+1));
            }
    
            if(edgeSize-1 < row)
            {
                var diff = row - (edgeSize-1);
                endColumn = Math.round(edgeSize*2-diff);
            }
    
            for (var column = startColumn; column < endColumn; column++)
            {
                var hexAxial = new HexAxial(row,column);    
                ceils.push(new CeilProperties(hexAxial));
            }
        }
        return ceils;
    }
}