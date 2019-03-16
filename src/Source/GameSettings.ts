
export class GameSettings{

    private _scale:number = 1;
    private handlers: { (data: boolean): void; }[] = [];
    Size:number=50;
    ScreenWidth:number;
    ScreenHeight:number;
    RotationSpeed:number=0.05;
    TranslationSpeed:number=1;
    Attack:number=30;

    public GetRelativeWidth():number{
        return this.ScreenWidth/this._scale;
    }

    isZoomIn(): boolean {
        return this._scale > 1.4;
    }

    public GetRelativeHeight():number{
        return this.ScreenHeight/this._scale;
    }

    public GetScale():number{
        return this._scale;
    }

    public ChangeScale(scale:number){
        const previousScale = this._scale;
        this._scale = scale;

        if(previousScale > 1.4 !== this._scale > 1.4){
            console.log(`scale changed ` + this.isZoomIn());
            this.handlers.forEach(handler=>{
                handler(this.isZoomIn());
            })
        }
    }

    public Subscribe(func:{(t:boolean):void}){
        this.handlers.push(func);
    }

    public UnSubscribe(func:{(t:boolean):void}){
        this.handlers = this.handlers.filter(h => h !== func);
    }

}