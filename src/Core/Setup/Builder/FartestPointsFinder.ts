import { HexAxial } from "../../Utils/Coordinates/HexAxial";
import { ToolBox } from "../../Items/Unit/Utils/ToolBox"; 

export class FartestPointsFinder{

    public GetFartestPoints(currentPoint:HexAxial,points:Array<HexAxial>):Array<HexAxial>{
        var longest = Math.trunc(Math.max(...points.map(p=> ToolBox.GetDistance(currentPoint,p))))-1;
        return points.filter(p=>ToolBox.GetDistance(currentPoint,p)>longest);
    }

    public GetPoints(points:Array<HexAxial>, total:number):Array<HexAxial>{
        let result = new Array<HexAxial>();
        result.push(points[0])
        while(result.length < total){
            let candidate = this.GetFarthestPoint(result,points);
            result.push(candidate);
        }
        return result;
    }

    private GetFarthestPoint(hqPoints:Array<HexAxial>, candidatePoints:Array<HexAxial>):HexAxial{
        let candidates = new Array<DistancePoint>();
        candidatePoints.forEach(candidatePoint=>{
            let candidate = new DistancePoint();
            let distances = new Array<number>();
            hqPoints.forEach(hqPoint => {
                distances.push(ToolBox.GetDistance(candidatePoint, hqPoint));
            });
            candidate.Point = candidatePoint;
            candidate.Distance = Math.min(...distances);
            candidates.push(candidate);
        });
        var max = Math.max(...candidates.map(c=>c.Distance)); 
        return candidates.filter(c=>c.Distance === max)[0].Point;
    }
}

export class DistancePoint{
    Point:HexAxial;
    Distance:number;
}