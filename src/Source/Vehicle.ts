import {Ceil} from './Ceil';
import {CeilProperties} from './CeilProperties';
import {Item} from './Item';
import {InteractionContext} from './InteractionContext';
import {PlaygroundHelper} from './PlaygroundHelper';
import { BoundingBox } from "./BoundingBox";
import {Dust} from './Dust';
import { AliveItem } from './AliveItem';
import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from './IMovable';
import { IRotationMaker } from './IRotationMaker';
import { IAngleFinder } from './IAngleFinder';
import { TranslationMaker } from './TranslationMaker';
import { RotationMaker } from './RotationMaker';
import { AngleFinder } from './AngleFinder';
import { IRotatable } from './IRotatable';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable{
    protected RootSprites:Array<PIXI.Sprite>;
    protected Wheels:Array<PIXI.Sprite>;
    private WheelIndex:number;

    //movable
    CurrentRadius:number;
    GoalRadius:number;
    CurrentNextCeil:Ceil;
    CurrentCeil:Ceil;
    private NextCeils:Array<Ceil>;
    protected FinalCeil:Ceil;

    protected BoundingBox:BoundingBox;
    private Size:number;
    private DustIndex:number;
    protected Dusts:Array<Dust>;
    protected selectionFunc:any;

    private _translationMaker:ITranslationMaker;
    private _rotationMaker:IRotationMaker;
    private _angleFinder:IAngleFinder;

    constructor(){
        super();
        this.CurrentRadius = 0;
        this.NextCeils = new Array<Ceil>();
        this.BoundingBox = new BoundingBox();

        this.Z= 2;
        this.Size = PlaygroundHelper.Settings.Size;
        this.BoundingBox.Width = CeilProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CeilProperties.GetHeight(this.Size);

        this.RootSprites = new Array<PIXI.Sprite>();
        this.Dusts = new Array<Dust>();
        this.Wheels =  new Array<PIXI.Sprite>();
        this.WheelIndex = 0;
        this.DustIndex = 0;
        this.selectionFunc = this.Selected.bind(this);

        this._translationMaker = new TranslationMaker<Vehicle>(this);
        this._rotationMaker = new RotationMaker<Vehicle>(this,0.03);
        this._angleFinder = new AngleFinder<Vehicle>(this);
    }

    public GetBoundingBox():BoundingBox{
        return this.BoundingBox;
    }

    private ShouldMove():Boolean{
        return this.NextCeils.length != 0 
        || this.CurrentNextCeil != null
    }

    private FindNext():void{
        this.CurrentNextCeil = this.NextCeils[0];
        this.NextCeils.splice(0,1);

        if(this.CurrentNextCeil.IsBlocked())
        {
            if(this.FinalCeil == this.CurrentNextCeil)
            {
                this.CurrentNextCeil = null;
                this.NextCeils = [];
            }
            else
            {
                this.SetNextCeils(); 
                this.FindNext();
                return;
            }
        }

        if(this.CurrentCeil == null)
        {
            this.GoalRadius = this.CurrentRadius;
        }
        else
        {
            this._angleFinder.SetAngle(this.CurrentNextCeil);
        }
    }

    private Move():void
    {
        if(this.CurrentRadius != this.GoalRadius)
        {
            this._rotationMaker.Rotate();
            this.SetRotation();
        }
        else
        {
            this._translationMaker.Translate();
        }
        this.HandleMovingEffect();
    }

    private SetRotation():void{
        this.RootSprites.forEach(sprite => {
            sprite.rotation = this.CurrentRadius;
        });
    };

    private HandleMovingEffect():void{
        this.HandleWheels();
        this.HandleDust();
    }

    private HandleWheels():void{
        var previousWheel = this.Wheels[this.WheelIndex]; 

        this.WheelIndex = (this.WheelIndex+1) % this.Wheels.length;

        this.Wheels[this.WheelIndex].alpha = 1;
        previousWheel.alpha = 0;
    }

    private HandleDust():void{
        this.DustIndex += 1;

        if(this.DustIndex % 12 == 0)
        {
            let center=this.GetBoundingBox().GetCenter();
            let middle=this.GetBoundingBox().GetMiddle(); 
            let width = this.GetBoundingBox().Width;
            let height = this.GetBoundingBox().Height;

            this.CreateDust(center + width/3*Math.cos(this.CurrentRadius)
            , middle + height/3*Math.sin(this.CurrentRadius));
            
            this.CreateDust(center - width/3*Math.cos(this.CurrentRadius)
            , middle - height/3*Math.sin(this.CurrentRadius));
        }
    }

    abstract CreateDust(x:number,y:number):void

    private Moving():void
    {
        if(this.ShouldMove())
        {
            if(this.CurrentNextCeil == null)
            {
                this.FindNext();
            }
            else
            {
                this.Move();
            }
        }
    }

    public Destroy():void{
        this.CurrentCeil.SetMovable(null);
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
    }

    public Update(viewX: number, viewY: number, zoom: number):void{
        if(!this.IsAlive())
        {
            this.Destroy();
            return;
        }

        this.Moving();
        
        super.Update(viewX,viewY,zoom);

        //handle
        this.Dusts.forEach(dust=>{
            dust.Update(viewX,viewY,zoom);
        });

        if(0 < this.Dusts.length)
        {
            var doneDusts = this.Dusts.filter(d=>d.isDone===1);
            doneDusts.forEach(dust=>{
                dust.Clear();
            });
            
            this.Dusts = this.Dusts.filter(d=>d.isDone===0);
        }	
    }

    SetPosition (ceil:Ceil):void{
        this.BoundingBox.X = ceil.GetBoundingBox().X;
        this.BoundingBox.Y = ceil.GetBoundingBox().Y;
        this.CurrentCeil = ceil;
        this.CurrentCeil.SetMovable(this);
    };

    public Select(context:InteractionContext):boolean
    {
        if(this.GetSprites()[0].containsPoint(context.Point))
        {
            context.SelectionEvent.on(this.selectionFunc);
            return true;
        }
        return false;
    }

    protected Selected(obj:any, item:Item):void
    {
        var context = obj as InteractionContext;
        var finalCeil = item as Ceil;
        //console.log(`%c SELECTED `,'color:green; font-weight:bold;');

        if(finalCeil != null && !finalCeil.IsBlocked())
        {
            this.FinalCeil = finalCeil;
            this.SetNextCeils(); 
            //console.log(`%c opened nodes: ${this.NextCeils.length} `,'color:blue;','font-weight:bold;');
        }

        context.SelectionEvent.off(this.selectionFunc);
    }

    protected SetNextCeils():void{
        if(this.NextCeils != null && this.NextCeils.length){
            this.NextCeils.forEach(ceil => {
                ceil.SetPathStatus(false);
            });
        }
        this.NextCeils = PlaygroundHelper.Engine.GetPath(this.CurrentCeil, this.FinalCeil); 

        if(this.NextCeils != null && this.NextCeils.length){
            this.NextCeils.forEach(ceil => {
                ceil.SetPathStatus(true);
            });
        }
    }

}