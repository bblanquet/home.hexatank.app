export class GameSettings{
    Size:number=50;
    ScreenWidth:number;
    ScreenHeight:number;
    Scale:number = 1;
    RotationSpeed:number=0.05;
    TranslationSpeed:number=1;
    Attack:number=30;

    public GetRelativeWidth():number{
        return this.ScreenWidth/this.Scale;
    }

    public GetRelativeHeight():number{
        return this.ScreenHeight/this.Scale;
    }
}