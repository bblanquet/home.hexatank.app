import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Coordinates/HexAxial';
import { CellProperties } from '../../Cell/CellProperties';

export class SpecHexagonalMapBuilder implements IPlaygroundBuilder<CellProperties>{
    GetMidle(n: number): HexAxial {
        throw new Error("Method not implemented.");  
    }
    GetAreaMiddlecell(n: number): HexAxial[] {
        throw new Error("Method not implemented.");
    }

    Build(edgeSize:number): CellProperties[] { 
        if(edgeSize < 2)
        {
            throw new Error();
        }
    
        if(edgeSize % 2 != 0){
            throw new Error();
        }

        var cells = new Array<CellProperties>();

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
                cells.push(new CellProperties(hexAxial));
            }
        }
        return cells;
    }
}