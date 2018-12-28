import { Point } from "./Point";

export class BoundingBox{
    X:number;
    Y:number;
    Width:number;
    Height:number;

    constructor(){
        this.X = 0;
        this.Y = 0;
        this.Width = 0;
        this.Height = 0;
    }

    GetCenter ():number{
        return (this.X + this.Width/2);
    };
    
    public GetMiddle ():number{
        return (this.Y + this.Height/2);
    };

    public GetPosition():Point{
        return new Point(this.X,this.Y);
    }

    public GetCentralPoint():Point
    {
        return new Point
        (this.GetCenter(),this.GetMiddle());
    }

    public Contains(point:{X:number, Y:number}):boolean{
        return this.X <= point.X && point.X <= (this.X+this.Width) && this.Y <= point.Y && point.Y <= (this.Y+this.Height);
    }

    public ToString():String{
        return `x${this.X} y${this.Y} w${this.Width} h${this.Height}`;
    }
}