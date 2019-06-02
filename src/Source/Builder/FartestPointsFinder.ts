import { HexAxial } from "../Coordinates/HexAxial";

export class FartestPointsFinder{

    public GetFartestPoints(currentPoint:HexAxial,points:Array<HexAxial>):Array<HexAxial>{
        var longest = Math.trunc(Math.max(...points.map(p=> this.GetDistance(currentPoint,p))))-1;
        return points.filter(p=>this.GetDistance(currentPoint,p)>longest);
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
                distances.push(this.GetDistance(candidatePoint, hqPoint));
            });
            candidate.Point = candidatePoint;
            candidate.Distance = Math.min(...distances);
            candidates.push(candidate);
        });
        var max = Math.max(...candidates.map(c=>c.Distance)); 
        return candidates.filter(c=>c.Distance === max)[0].Point;
    }

    private GetDistance(point:HexAxial, compareToPoint:HexAxial):number{
        return Math.abs(
            Math.sqrt(
                Math.pow(point.Q - compareToPoint.Q,2) 
                + Math.pow(point.R - compareToPoint.R,2)));
    }

}

export class DistancePoint{
    Point:HexAxial;
    Distance:number;
}