import { Point } from '../Utils/Point'; 
import { HexAxial } from '../Utils/Coordinates/HexAxial';

export interface ICell
{
    GetCoordinate():HexAxial;
    GetNeighbourhood():Array<ICell>;
    GetCentralPoint():Point;
}