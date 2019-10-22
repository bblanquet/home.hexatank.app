import { ViewContext } from "./ViewContext";

export class GameSettings
{

    private _viewContext:ViewContext=new ViewContext();
    private _scaleHandlers: {(data: boolean):void}[] = [];
    public Size:number=50;
    public ScreenWidth:number; 
    public ScreenHeight:number;
    public RotationSpeed:number=0.2;
    public TurrelRotationSpeed:number=0.2;
    public TranslationSpeed:number=2;
    public MissileTranslationSpeed:number=5;
    public IsPause:boolean=false;
    public ShowEnemies:boolean=false;
    public Attack:number=30;
    public TankPrice:number=8;
    public TruckPrice:number=4;
    public FieldPrice:number=2;
    public PocketMoney:number=20;

    private _fps:number=60;
    private _fpsHandlers:{(data: number):void}[] = [];
    public MapSize: number=0;

    public GetFps():number{
        return this._fps;
    }

    public isZoomIn(): boolean {
        return this._viewContext.Scale > 1.4;
    }

    public GetX():number{
        return this._viewContext.BoundingBox.X;
    }

    public GetY():number{
        return this._viewContext.BoundingBox.Y;
    }

    public SetX(x:number):void{
        this._viewContext.BoundingBox.X = x;
    }

    public SetY(y:number):void{
        this._viewContext.BoundingBox.Y = y;
    }

    public ChangeScale(scale:number){
        const previousScale = this._viewContext.Scale;
        this._viewContext.Scale = scale;
        console.log("scale "+ scale);
        if(previousScale > 1.4 !== this._viewContext.Scale > 1.4){
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