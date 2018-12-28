import { HexCube } from "./HexCube";
import { Point } from "../Point";
/* See   */

/* Using flat-topped hexagons, "odd-q" vertical layout
 *    __    __
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 *   /  \__/  \__/  \
 *   \__/  \__/  \__/
 */


export class HexAxial{
    Q:number;//column
    R:number;//row

    constructor(q:number, r:number){
        this.Q = q;
        this.R = r;
    }

    ToString ():string {
        return "HexAxial(" + [this.Q, this.R].toString() + ")";
    };
    
    ToCube ():HexCube {
        return new HexCube(this.Q, this.R, -this.Q - this.R);
    };
    
    ToAxial():HexAxial{
        return new HexAxial(this.Q, this.R);
    };
    
    ToOffset () {
        return this.ToCube().ToOffset();
    };
    
    GetNeighbour(direction:number):HexAxial{
        var deltas = [[+1, -1], [+1,  0], [0, +1],
                      [-1, +1], [-1,  0], [0, -1]];
        return new HexAxial(this.Q + (deltas[direction][0]),
                            this.R + (deltas[direction][1]));
    };

    GetNeighbours():Array<HexAxial>{
        var result = new Array<HexAxial>();
        var deltas = [[+1, -1], [+1,  0], [0, +1],
                      [-1, +1], [-1,  0], [0, -1]];
                      
        deltas.forEach (delta => {
            result.push(
                new HexAxial(this.Q + (delta[0]),
                            this.R + (delta[1])));
        });

        return result;
    }
    
    ToPixel(size:number):Point {
        // size is option, see HexCube method
        return this.ToCube().ToPixel(size);
    };
}