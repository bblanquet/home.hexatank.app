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
import { isNullOrUndefined } from 'util';
import { Sprite } from 'pixi.js';
import { Crater } from './Crater';
import { BasicItem } from './BasicItem';
import { CeilState } from './CeilState';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable{


    RotationSpeed: number=0.05;
    TranslationSpeed: number=1;
    protected RootSprites:Array<PIXI.Sprite>;
    protected Wheels:Array<PIXI.Sprite>;
    private WheelIndex:number;
    protected PathItems:Array<BasicItem>;

    //movable
    CurrentRadius:number;
    GoalRadius:number;
    protected NextCeil:Ceil;
    protected CurrentCeil:Ceil;
    private NextCeils:Array<Ceil>;
    protected FinalCeil:Ceil;

    public PratrolCeils:Array<Ceil>;
    public CurrentPratolCeil:Ceil;
    protected IsSettingPatrol:boolean=false;

    protected BoundingBox:BoundingBox;
    private Size:number;
    private DustIndex:number;
    protected selectionFunc:any;

    private _translationMaker:ITranslationMaker;
    private _rotationMaker:IRotationMaker;
    private _angleFinder:IAngleFinder;

    private _selectionSprite:Sprite;

    constructor(){
        super();
        this.CurrentRadius = 0;
        this.NextCeils = new Array<Ceil>();
        this.BoundingBox = new BoundingBox();

        this._selectionSprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures['selection']);
        this.DisplayObjects.push(this._selectionSprite);
        this._selectionSprite.alpha = 0;

        this.Z= 2;
        this.Size = PlaygroundHelper.Settings.Size;
        this.BoundingBox.Width = CeilProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CeilProperties.GetHeight(this.Size);

        this.PratrolCeils = new Array<Ceil>();
        this.RootSprites = new Array<PIXI.Sprite>();

        this.Wheels =  new Array<PIXI.Sprite>();
        this.WheelIndex = 0;
        this.DustIndex = 0;
        this.selectionFunc = this.Selected.bind(this);

        this._translationMaker = new TranslationMaker<Vehicle>(this);
        this._rotationMaker = new RotationMaker<Vehicle>(this);
        this._angleFinder = new AngleFinder<Vehicle>(this);
    }

    public SetPatrol(context:InteractionContext):void
    {
        this.IsSettingPatrol = !this.IsSettingPatrol;
        
        if(!this.IsSettingPatrol)
        {
            PlaygroundHelper.OnVehiculeUnSelected.trigger(this,this);
            context.SelectionEvent.off(this.selectionFunc);
            this._selectionSprite.alpha = 0;
        }
    }

    public IsPatroling():boolean{
        return !isNullOrUndefined(this.PratrolCeils) && 0 < this.PratrolCeils.length;
    }

    public GetBoundingBox():BoundingBox{
        return this.BoundingBox;
    }

    private HasNextCeil():Boolean{
        return this.NextCeils.length != 0 
        || this.NextCeil != null
    }

    private FindNextCeil():void{
        this.NextCeil = this.NextCeils[0];
        this.NextCeils.splice(0,1);

        if(this.NextCeil.IsBlocked())
        {
            if(this.FinalCeil == this.NextCeil)
            {
                this.NextCeil = null;
                this.NextCeils = [];
            }
            else
            {
                this.SetNextCeils(); 
                this.FindNextCeil();
                return;
            }
        }

        if(this.CurrentCeil == null)
        {
            this.GoalRadius = this.CurrentRadius;
        }
        else
        {
            this._angleFinder.SetAngle(this.NextCeil);
        }
    }

    private Moving():void
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

            this.CreateDust(center + width/4*Math.cos(this.CurrentRadius)
            , middle + height/4*Math.sin(this.CurrentRadius));
            
            this.CreateDust(center - width/3*Math.cos(this.CurrentRadius)
            , middle - height/3*Math.sin(this.CurrentRadius));
        }
    }

    private CreateDust(x:number,y:number):void
    {
        var b = new BoundingBox();
        b.X = x;
        b.Y = y;
        b.Width = this.GetBoundingBox().Width/5;
        b.Height = this.GetBoundingBox().Width/5;

        var dust = new Dust(b);
        PlaygroundHelper.Render.Add(dust);
        PlaygroundHelper.Playground.Items.push(dust);
    }

    private Acting():void
    {
        if(this.HasNextCeil())
        {
            if(this.NextCeil == null)
            {
                this.FindNextCeil();
            }
            else
            {
                this.Moving();
            }
        }
        else
        {
            if(this.IsPatroling())
            {
                var index = (this.PratrolCeils.indexOf(this.CurrentPratolCeil)+1) % this.PratrolCeils.length;
                this.CurrentPratolCeil = this.PratrolCeils[index];
                this.FinalCeil = this.CurrentPratolCeil;
                this.SetNextCeils();
            }
        }
    }

    public GetNextCeil(): Ceil {
        return this.NextCeil;
    }

    MoveNextCeil(): void {
        var previousCeil = this.CurrentCeil;

        this.CurrentCeil.SetMovable(null);
        this.CurrentCeil = this.NextCeil;
        this.CurrentCeil.SetMovable(this);
        this.NextCeil = null;

        this.PathItems.splice(0,1)[0].Destroy();
        this.CurrentCeil.GetAllNeighbourhood().forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        });

        previousCeil.GetAllNeighbourhood().forEach(childCeil => {
            var child = (<Ceil>childCeil);
            if(child.GetAllNeighbourhood().filter(c=>!isNullOrUndefined((<Ceil>c).GetMovable())).length===0){
                child.SetState(CeilState.HalfVisible);
            }
        });
    }

    protected Destroy():void{
        this.CurrentCeil.SetMovable(null);
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
    }

    public Update(viewX: number, viewY: number, zoom: number):void{
        if(!this.IsAlive())
        {
            this.Destroy();
            let crater = new Crater(this.BoundingBox);
            PlaygroundHelper.Playground.Items.push(crater);
            return;
        }

        this.CurrentCeil.Field.Support(this); 

        this.Acting();
        
        super.Update(viewX,viewY,zoom);
    }

    public SetPosition (ceil:Ceil):void{
        this.BoundingBox.X = ceil.GetBoundingBox().X;
        this.BoundingBox.Y = ceil.GetBoundingBox().Y;
        this.CurrentCeil = ceil;
        this.CurrentCeil.SetMovable(this);
        this.CurrentCeil.GetAllNeighbourhood().forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        });
    };

    public Select(context:InteractionContext):boolean
    {
        if(this.GetSprites()[0].containsPoint(context.Point))
        {
            context.SelectionEvent.on(this.selectionFunc);
            PlaygroundHelper.OnVehiculeSelected.trigger(this,this);
            this._selectionSprite.alpha = 1;
            return true;
        }
        return false;
    }

    protected Selected(obj:any, item:Item):void
    {
        var ceil = item as Ceil;
        if(!this.IsSettingPatrol)
        {
            if(this.IsPatroling()) //cancel patroling
            {
                this.PratrolCeils = new Array<Ceil>();
            }

            var context = obj as InteractionContext;    
            if(!isNullOrUndefined(ceil) && !ceil.IsBlocked())
            {
                this.FinalCeil = ceil;
                this.SetNextCeils(); 
            }

            context.SelectionEvent.off(this.selectionFunc);
            PlaygroundHelper.OnVehiculeUnSelected.trigger(this,this);
            this._selectionSprite.alpha = 0;
        }
        else
        {
            this.PratrolCeils.push(ceil);
        }
    }

    protected SetNextCeils():void{
        if(!isNullOrUndefined(this.PathItems) && this.PathItems.length){
            this.PathItems.forEach(pathItem => {
                pathItem.Destroy();
            });
        }
        this.PathItems = [];

        this.NextCeils = PlaygroundHelper.Engine.GetPath(this.CurrentCeil, this.FinalCeil); 

        if(this.NextCeils != null && this.NextCeils.length){
            this.NextCeils.forEach(ceil => {
                var pathItem = new BasicItem(ceil.GetBoundingBox(),new Sprite(PlaygroundHelper.Render.Textures['pathCeil']));
                this.PathItems.push(pathItem);
                PlaygroundHelper.Playground.Items.push(pathItem);
            });
        }
    }

}