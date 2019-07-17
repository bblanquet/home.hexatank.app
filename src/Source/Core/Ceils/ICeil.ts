import { HexAxial } from '../Utils/Coordinates/HexAxial';
import { Point } from '../Utils/Point';

export interface ICeil
{
    GetCoordinate():HexAxial;
    GetNeighbourhood():Array<ICeil>;
    GetCentralPoint():Point;
}