import { HexAxial } from "../../Coordinates/HexAxial";
import { Point } from "../../Point";

export class ToolBox{

    public static GetDist(point:Point, compareToPoint:Point):number{
        return Math.abs(
            Math.sqrt(
                Math.pow(point.X - compareToPoint.X,2) 
                + Math.pow(point.Y - compareToPoint.Y,2)));
    }


    public static GetDistance(point:HexAxial, compareToPoint:HexAxial):number{
        return Math.abs(
            Math.sqrt(
                Math.pow(point.Q - compareToPoint.Q,2) 
                + Math.pow(point.R - compareToPoint.R,2)));
    }


    public static GetRandomElement<T>(list:Array<T>):T{
        return list[Math.floor(Math.random() * (list.length-1)) + 0];
    }
}