import { HexAxial } from '../Coordinates/HexAxial';
import { Point } from '../Point'; 

export interface ICeil
{
    GetCoordinate():HexAxial;
    GetNeighbourhood():Array<ICeil>;
    GetCentralPoint():Point;
}