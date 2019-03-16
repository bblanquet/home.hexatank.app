import {Ceil} from '../Ceil';
import {CeilProperties} from '../CeilProperties';
import {InteractionContext} from '../Context/InteractionContext';
import {PlaygroundHelper} from '../PlaygroundHelper';
import { BoundingBox } from "../BoundingBox";
import {Dust} from './Dust';
import { AliveItem } from '../AliveItem'; 
import { ITranslationMaker } from '../ITranslationMaker';
import { IMovable } from '../IMovable';
import { IRotationMaker } from '../IRotationMaker'; 
import { IAngleFinder } from '../IAngleFinder';
import { TranslationMaker } from '../TranslationMaker';
import { RotationMaker } from '../RotationMaker'; 
import { AngleFinder } from '../AngleFinder';
import { IRotatable } from '../IRotatable';
import { isNullOrUndefined } from 'util';
import { Crater } from '../Crater';
import { CeilState } from '../CeilState';
import { IOrder } from '../Ia/IOrder';
import { ISelectable } from '../ISelectable';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable, ISelectable
{
    RotationSpeed: number=0.05;
    TranslationSpeed: number=1;
    Attack:number=30;
    protected RootSprites:Array<string>;
    protected Wheels:Array<string>;
    protected BottomWheel:string;
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

    private _selectionSprite:string;

    constructor(){
        super();
        this.CurrentRadius = 0;
        this.BoundingBox = new BoundingBox();

        this._selectionSprite = 'selection';
        this.GenerateSprite(this._selectionSprite); 
        this.GetBothSprites(this._selectionSprite).forEach(sprite=>sprite.alpha = 0);

        this.Z= 2;
        this.Size = PlaygroundHelper.Settings.Size;
        this.BoundingBox.Width = CeilProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CeilProperties.GetHeight(this.Size);

        this.RootSprites = new Array<string>();

        this.Wheels =  new Array<string>();
        this.WheelIndex = 0;
        this.DustIndex = 0;

        this._translationMaker = new TranslationMaker<Vehicle>(this);
        this._rotationMaker = new RotationMaker<Vehicle>(this);
        this._angleFinder = new AngleFinder<Vehicle>(this);
    }

    public SetOrder(order: IOrder): void {
        if(!isNullOrUndefined(this._nextCeil))
        {
            this._nextCeil.SetOccupier(null);
        }
        if(!isNullOrUndefined(this._order)){
            this._order.Cancel();
        }

        this._order = order;
    }

    public CancelOrder():void{
        this._order.Cancel();
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
            this.GetBothSprites(sprite).forEach(sp=>sp.rotation= this.CurrentRadius);
        });
    };

    private HandleMovingEffect():void{
        this.HandleWheels();
        this.HandleDust();
    }

    private HandleWheels():void{
        var previousWheel = this.Wheels[this.WheelIndex]; 

        this.WheelIndex = (this.WheelIndex+1) % this.Wheels.length;

        this.SetProperty(this.Wheels[this.WheelIndex],(e)=>e.alpha= 1);
        this.SetProperty(previousWheel,(e)=>e.alpha= 0);

        //this.Wheels[this.WheelIndex].alpha = 1;
        //previousWheel.alpha = 0;
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
        PlaygroundHelper.Playground.Items.push(dust);
    }

    public IsSelected():boolean{
        return this.GetCurrentSprites()[this._selectionSprite].alpha === 1;
    }

    public SetSelected(state:boolean):void{
        this.SetProperty(this._selectionSprite,(e)=>e.alpha= state ? 1 : 0);
    }

    public GetNextCeil(): Ceil {
        return this._nextCeil;
    }

    public MoveNextCeil(): void {
        var previousCeil = this._currentCeil;

        this._currentCeil.SetOccupier(null);
        this._currentCeil = this._nextCeil;
        this._currentCeil.SetOccupier(this);
        this._nextCeil = null;

        this.SetVisible();
        this.SetHalVisible(previousCeil);
    }

    private SetHalVisible(previousCeil: Ceil) {
        var ceils = previousCeil.GetAllNeighbourhood();
        ceils.push(previousCeil);
        ceils.forEach(childCeil => {
            var child = (<Ceil>childCeil);
            if (isNullOrUndefined(child.GetOccupier()) 
            && child.GetAllNeighbourhood().filter(c => !isNullOrUndefined((<Ceil>c).GetOccupier())).length === 0) {
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

    public  Destroy():void{
        super.Destroy();
        this._currentCeil.SetOccupier(null);
        if(!isNullOrUndefined(this._nextCeil))
        {
            this._nextCeil.SetOccupier(null);
        }
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
    }

    public Update(viewX: number, viewY: number):void{
        if(!this.IsAlive())
        {
            this.Destroy();
            let crater = new Crater(this.BoundingBox);
            PlaygroundHelper.Playground.Items.push(crater);
            return;
        }

        if(this.ExistsOrder())
        {
            if(!this._order.IsDone())
            {
                this._order.Do(); 
            }
        }

        this._currentCeil.GetField().Support(this); 

        if(this.HasNextCeil())
        {
            this.Moving();
        }        
        super.Update(viewX,viewY);
    }

    public ExistsOrder():boolean{
        return !isNullOrUndefined(this._order);
    }

    public IsExecutingOrder():boolean{
        return !isNullOrUndefined(this._order) && !this._order.IsDone();
    }

    public SetPosition (ceil:Ceil):void{
        this.InitPosition(ceil.GetBoundingBox());
        this._currentCeil = ceil;
        this._currentCeil.SetOccupier(this);
        this.SetVisible();
    };

    public Select(context:InteractionContext):boolean
    {
        // if(this.GetSprites()[0].containsPoint(context.Point))
        // {
        //     context.OnSelect(this);
        //     return true;
        // }
        return false;
    }

    public SetNextCeil(ceil: Ceil): void {
        this._nextCeil = ceil;
        this._nextCeil.SetOccupier(this);
        this._angleFinder.SetAngle(this._nextCeil);
    }
    public GetCurrentCeil(): Ceil {
        return this._currentCeil;
    }
}
