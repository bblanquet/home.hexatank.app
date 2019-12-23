import { GameSettings } from '../Utils/GameSettings';
import { ICell } from "./ICell";
import { HexAxial } from "../Utils/Coordinates/HexAxial";
import { BoundingBox } from "../Utils/BoundingBox";
import { Point } from '../Utils/Point'; 
import { TestHelper } from "../Utils/TestHelper";

export class CellProperties implements ICell
{
    Coordinate:HexAxial;
    BoundingBox:BoundingBox;
    Size:number;

    constructor(coordinate:HexAxial){
        this.Coordinate = coordinate; 
        this.Size = GameSettings.Size;
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.Width = CellProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CellProperties.GetHeight(this.Size);
        var pos = this.Coordinate.ToPixel(this.Size);
        this.BoundingBox.X = pos.X;
        this.BoundingBox.Y = pos.Y;
    }

    public GetCentralPoint():Point{
        return this.BoundingBox.GetCentralPoint();
    }

    public GetNeighbourhood():Array<ICell>{
        var cells = new Array<ICell>();
        this.Coordinate.GetNeighbours().forEach(coordinate => {
            var cell = TestHelper.CellContainer.Get(coordinate);
            if(cell != null)
            {
                cells.push(cell);
            }
        });
        return cells;
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