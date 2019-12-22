import { Point } from '../Utils/Point'; 
import { HexAxial } from '../Utils/Coordinates/HexAxial';

export interface ICeil
{
    GetCoordinate():HexAxial;
    GetNeighbourhood():Array<ICeil>;
    GetCentralPoint():Point;
}