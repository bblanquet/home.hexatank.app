
export class Point{
    X:number;
    Y:number;

    constructor(x:number,y:number){
        this.X= x;
        this.Y = y;
    }

    public GetDistance(point:Point):number{
        return Math.abs(
            Math.sqrt(
                  Math.pow(this.X - point.X,2) 
                + Math.pow(this.Y - point.Y,2)));
    }
}