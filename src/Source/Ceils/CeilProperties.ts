import { ICeil } from "./ICeil";
import { Point } from "../Point";
import { BoundingBox } from "../BoundingBox";
import { HexAxial } from "../Coordinates/HexAxial";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { TestHelper } from "../TestHelper";

export class CeilProperties implements ICeil
{
    Coordinate:HexAxial;
    BoundingBox:BoundingBox;
    Size:number;

    constructor(coordinate:HexAxial){
        this.Coordinate = coordinate; 
        this.Size = PlaygroundHelper.Settings.Size;
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.Width = CeilProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CeilProperties.GetHeight(this.Size);
        var pos = this.Coordinate.ToPixel(this.Size);
        this.BoundingBox.X = pos.X;
        this.BoundingBox.Y = pos.Y;
    }

    public GetCentralPoint():Point{
        return this.BoundingBox.GetCentralPoint();
    }

    public GetNeighbourhood():Array<ICeil>{
        var ceils = new Array<ICeil>();
        this.Coordinate.GetNeighbours().forEach(coordinate => {
            var ceil = TestHelper.CeilsContainer.Get(coordinate);
            if(ceil != null)
            {
                ceils.push(ceil);
            }
        });
        return ceils;
    }

    public GetCoordinate():HexAxial{
        return this.Coordinate;
    }

    public static GetWidth(size:number){
        return 2*size;
    }

    public static GetHeight(size:number){
        return size * Math.sqrt(3);
    }
}