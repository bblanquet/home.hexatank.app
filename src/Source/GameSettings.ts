
export class GameSettings{

    private _scale:number = 1;
    private _scaleHandlers: {(data: boolean):void}[] = [];
    Size:number=50;
    ScreenWidth:number;
    ScreenHeight:number;
    RotationSpeed:number=0.05;
    TranslationSpeed:number=1;
    Attack:number=30;
    private _fps:number=0;
    private _fpsHandlers:{(data: number):void}[] = [];

    public GetRelativeWidth():number{
        return this.ScreenWidth/this._scale;
    }

    public GetFps():number{
        return this._fps;
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
            this._scaleHandlers.forEach(handler=>{
                handler(this.isZoomIn());
            });
        }
    }

    public ScaleSubscribe(func:{(t:boolean):void}){
        this._scaleHandlers.push(func);
    }

    public ScaleUnsubscribe(func:{(t:boolean):void}){
        this._scaleHandlers = this._scaleHandlers.filter(h => h !== func);
    }

    public ChangeFps(fps:number):void{
        this._fps = fps;
        //console.log(`fps ${this._fps}`)
        this._fpsHandlers.forEach(fpsHandler=>{
            fpsHandler(this._fps);
        })
    }

    public FpsSubscribe(func:{(t:number):void}){
        this._fpsHandlers.push(func);
    }

    public FpsUnsubscribe(func:{(t:number):void}){
        this._fpsHandlers = this._fpsHandlers.filter(h => h !== func);
    }
}