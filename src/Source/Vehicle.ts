import {Ceil} from './Ceil';
import {CeilProperties} from './CeilProperties';
import {Item} from './Item';
import {InteractionContext} from './Context/InteractionContext';
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
import { CeilState } from './CeilState';
import { IOrder } from './Ia/IOrder';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable{


    RotationSpeed: number=0.05;
    TranslationSpeed: number=1;
    protected RootSprites:Array<PIXI.Sprite>;
    protected Wheels:Array<PIXI.Sprite>;
    private WheelIndex:number;

    //movable
    CurrentRadius:number;
    GoalRadius:number;
    private _nextCeil:Ceil;
    private _currentCeil:Ceil;

    private _order:IOrder;

    protected BoundingBox:BoundingBox;
    private Size:number;
    private DustIndex:number;

    private _translationMaker:ITranslationMaker;
    private _rotationMaker:IRotationMaker;
    private _angleFinder:IAngleFinder;

    private _selectionSprite:Sprite;

    constructor(){
        super();
        this.CurrentRadius = 0;
        this.BoundingBox = new BoundingBox();

        this._selectionSprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures['selection']);
        this.DisplayObjects.push(this._selectionSprite);
        this._selectionSprite.alpha = 0;

        this.Z= 2;
        this.Size = PlaygroundHelper.Settings.Size;
        this.BoundingBox.Width = CeilProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CeilProperties.GetHeight(this.Size);

        this.RootSprites = new Array<PIXI.Sprite>();

        this.Wheels =  new Array<PIXI.Sprite>();
        this.WheelIndex = 0;
        this.DustIndex = 0;

        this._translationMaker = new TranslationMaker<Vehicle>(this);
        this._rotationMaker = new RotationMaker<Vehicle>(this);
        this._angleFinder = new AngleFinder<Vehicle>(this);
    }

    public SetOrder(order: IOrder): void {
        this._order = order;
    }

    public GetBoundingBox():BoundingBox{
        return this.BoundingBox;
    }

    private HasNextCeil():Boolean{
        return this._nextCeil != null
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

    public IsSelected():boolean{
        return this._selectionSprite.alpha === 1;
    }

    public SetSelected(state:boolean):void{
        this._selectionSprite.alpha = state ? 1 : 0;
    }

    public GetNextCeil(): Ceil {
        return this._nextCeil;
    }

    public MoveNextCeil(): void {
        var previousCeil = this._currentCeil;

        this._currentCeil.SetMovable(null);
        this._currentCeil = this._nextCeil;
        this._currentCeil.SetMovable(this);
        this._nextCeil = null;

        this.SetVisible();
        this.SetHalVisible(previousCeil);
    }

    private SetHalVisible(previousCeil: Ceil) {
        var ceils = previousCeil.GetAllNeighbourhood();
        ceils.push(previousCeil);
        ceils.forEach(childCeil => {
            var child = (<Ceil>childCeil);
            if (isNullOrUndefined(child.GetMovable()) 
            && child.GetAllNeighbourhood().filter(c => !isNullOrUndefined((<Ceil>c).GetMovable())).length === 0) {
                child.SetState(CeilState.HalfVisible);
            }
        });
    }

    private SetVisible() {
        var ceils = this._currentCeil.GetAllNeighbourhood();
        ceils.push(this._currentCeil);
        ceils.forEach(ceil => {
            (<Ceil>ceil).SetState(CeilState.Visible);
        });
    }

    protected Destroy():void{
        this._currentCeil.SetMovable(null);
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

        if(this.ExistsOrder() && !this._order.IsDone())
        {
            this._order.Do(); 
        }

        this._currentCeil.Field.Support(this); 

        if(this.HasNextCeil())
        {
            this.Moving();
        }        
        super.Update(viewX,viewY,zoom);
    }

    private ExistsOrder():boolean{
        return !isNullOrUndefined(this._order);
    }

    public SetPosition (ceil:Ceil):void{
        this.BoundingBox.X = ceil.GetBoundingBox().X;
        this.BoundingBox.Y = ceil.GetBoundingBox().Y;
        this._currentCeil = ceil;
        this._currentCeil.SetMovable(this);
        this.SetVisible()
    };

    public Select(context:InteractionContext):boolean
    {
        if(this.GetSprites()[0].containsPoint(context.Point))
        {
            context.OnSelect(this);
            return true;
        }
        return false;
    }

    public SetNextCeil(ceil: Ceil): void {
        this._nextCeil = ceil;
        this._angleFinder.SetAngle(this._nextCeil);
    }
    public GetCurrentCeil(): Ceil {
        return this._currentCeil;
    }
}













        // else
        // {
        //     if(this.IsPatroling())
        //     {
        //         var index = (this.PratrolCeils.indexOf(this.CurrentPratolCeil)+1) % this.PratrolCeils.length;
        //         this.CurrentPratolCeil = this.PratrolCeils[index];
        //         this.FinalCeil = this.CurrentPratolCeil;
        //         this.SetNextCeils();
        //     }
        // }


        // if(this.NextCeil.IsBlocked())
        // {
        //     if(this.FinalCeil == this.NextCeil)
        //     {
        //         this.NextCeil = null;
        //         this.NextCeils = [];
        //     }
        //     else
        //     {
        //         this.SetNextCeils(); 
        //         this.FindNextCeil();
        //         return;
        //     }
        // }


        // var ceil = item as Ceil;
        // if(!this.IsSettingPatrol)
        // {
        //     if(this.IsPatroling()) //cancel patroling
        //     {
        //         this.PratrolCeils = new Array<Ceil>();
        //         this.PatrolItems.forEach(pathItem => {
        //             pathItem.Destroy();
        //         });
        //     }

        //     var context = obj as InteractionContext;    
        //     if(!isNullOrUndefined(ceil) && !ceil.IsBlocked())
        //     {
        //         this.FinalCeil = ceil;
        //         this.SetNextCeils(); 
        //     }

        //     context.SelectionEvent.off(this.selectionFunc);
        //     PlaygroundHelper.OnVehiculeUnSelected.trigger(this,this);
        //     this._selectionSprite.alpha = 0;
        // }
        // else
        // {
        //     this.PratrolCeils.push(ceil);
        //     var patrolItem = new BasicItem(ceil.GetBoundingBox(),new Sprite(PlaygroundHelper.Render.Textures['selectedCeil']));
        //     this.PathItems.push(patrolItem);
        //     PlaygroundHelper.Playground.Items.push(patrolItem);
        // }


        // if(!isNullOrUndefined(this.PathItems) && this.PathItems.length){
        //     this.PathItems.forEach(pathItem => {
        //         pathItem.Destroy();
        //     });
        // }

        // this.PathItems = [];

        // this.NextCeils = PlaygroundHelper.Engine.GetPath(this.CurrentCeil, this.FinalCeil); 

        // if(this.NextCeils != null && this.NextCeils.length){
        //     this.NextCeils.forEach(ceil => {
        //         var pathItem = new BasicItem(ceil.GetBoundingBox(),new Sprite(PlaygroundHelper.Render.Textures['pathCeil']));
        //         this.PathItems.push(pathItem);
        //         PlaygroundHelper.Playground.Items.push(pathItem);
        //     });
        // }