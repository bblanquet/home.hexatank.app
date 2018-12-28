import { IPlaygroundBuilder } from './IPlaygroundMaker';
import { HexAxial } from './Coordinates/HexAxial';
import {Ceil} from './Ceil';
import {CeilProperties} from './CeilProperties';

export class PlaygroundBuilder implements IPlaygroundBuilder<Ceil>{
    EdgeSize:number;

    constructor(edgeSize:number){
        if(edgeSize < 2)
        {
            throw new Error();
        }
    
        if(edgeSize % 2 != 0){
            throw new Error();
        }

        this.EdgeSize = edgeSize;
    }

    Build(): Ceil[] {

        var ceils = new Array<Ceil>();

        var doubleEdgeSize = Math.round(this.EdgeSize*2);
        var row = -1;
        for(row = -1; row < doubleEdgeSize ; row++){

            var startColumn = 0;
            var endColumn = Math.round(this.EdgeSize*2);
    
            if(row < this.EdgeSize-1)
            {
                startColumn = Math.round(this.EdgeSize - (row+1));
            }
    
            if(this.EdgeSize-1 < row)
            {
                var diff = row - (this.EdgeSize-1);
                endColumn = Math.round(this.EdgeSize*2-diff);
            }
    
            for (var column = startColumn; column < endColumn; column++)
            {
                var hexAxial = new HexAxial(row,column);    
                var ceil = new Ceil(new CeilProperties(hexAxial));
                ceils.push(ceil);
            }
        }
        return ceils;
    }
}