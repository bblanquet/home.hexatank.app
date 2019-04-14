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
import { Timer } from '../Tools/Timer';
import { Archive } from '../Tools/ResourceArchiver';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable, ISelectable
{
    
    RotationSpeed: number=0.05;
    TranslationSpeed: number=1;
    Attack:number=30;
    protected RootSprites:Array<string>;
    protected Wheels:Array<string>;
    private WheelIndex:number;

    //movable
    CurrentRadius:number;
    GoalRadius:number;
    private _nextCeil:Ceil;
    private _currentCeil:Ceil;

    private _order:IOrder;

    protected BoundingBox:BoundingBox;
    private Size:number;

    private _translationMaker:ITranslationMaker;
    private _rotationMaker:IRotationMaker;
    private _angleFinder:IAngleFinder;
    private _pendingOrder:IOrder;

    private _dustTimer:Timer;
    private _dustIndex:number;
    private _leftDusts:Array<Dust>;
    private _rightDusts:Array<Dust>;

    constructor(){
        super();
        this.CurrentRadius = 0;
        this.BoundingBox = new BoundingBox();

        this.GenerateSprite(Archive.selectionUnit); 
        this.GetBothSprites(Archive.selectionUnit).forEach(sprite=>sprite.alpha = 0);

        this.Z= 2;
        this.Size = PlaygroundHelper.Settings.Size;
        this.BoundingBox.Width = CeilProperties.GetWidth(this.Size);
        this.BoundingBox.Height = CeilProperties.GetHeight(this.Size);

        this.RootSprites = new Array<string>();

        this.Wheels =  new Array<string>();
        this.WheelIndex = 0;
        this._dustTimer = new Timer(12);
        this._dustIndex = 0;

        this._translationMaker = new TranslationMaker<Vehicle>(this);
        this._rotationMaker = new RotationMaker<Vehicle>(this);
        this._angleFinder = new AngleFinder<Vehicle>(this);
        this._leftDusts = [new Dust(new BoundingBox()),new Dust(new BoundingBox()),new Dust(new BoundingBox()),new Dust(new BoundingBox())];
        this._rightDusts = [new Dust(new BoundingBox()),new Dust(new BoundingBox()),new Dust(new BoundingBox()),new Dust(new BoundingBox())];
        this._leftDusts.forEach(ld=>PlaygroundHelper.Playground.Items.push(ld));
        this._rightDusts.forEach(rd=>PlaygroundHelper.Playground.Items.push(rd));
    }

    private _visibleHandlers: { (data: ISelectable):void }[] = [];

    SubscribeUnselection(handler: (data: ISelectable) => void): void {
        this._visibleHandlers.push(handler);
    }
    Unsubscribe(handler: (data: ISelectable) => void): void {
        this._visibleHandlers = this._visibleHandlers.filter(h => h !== handler);
    }

    public SetOrder(order: IOrder): void {
        this._pendingOrder = order;

        if(!isNullOrUndefined(this._order))
        {
            this._order.Cancel();
        }
    }

    public CancelOrder():void{
        this._order.Cancel();
    }

    public GetBoundingBox():BoundingBox{
        return this.BoundingBox;
    }

    private HasNextCeil():Boolean{
        return !isNullOrUndefined(this._nextCeil);
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

    }

    private HandleDust():void{
        if(this._dustTimer.IsElapsed())
        {
            let center=this.GetBoundingBox().GetCenter();
            let middle=this.GetBoundingBox().GetMiddle(); 
            let width = this.GetBoundingBox().Width;
            let height = this.GetBoundingBox().Height;

            const leftb = new BoundingBox();
            leftb.X = center + width/4*Math.cos(this.CurrentRadius);
            leftb.Y = middle + height/4*Math.sin(this.CurrentRadius);
            leftb.Width = this.GetBoundingBox().Width/5;
            leftb.Height = this.GetBoundingBox().Width/5;

            this._leftDusts[this._dustIndex].Reset(leftb);
            
            const rightb = new BoundingBox();
            rightb.X = center - width/3*Math.cos(this.CurrentRadius);
            rightb.Y = middle - height/3*Math.sin(this.CurrentRadius);
            rightb.Width = this.GetBoundingBox().Width/5;
            rightb.Height = this.GetBoundingBox().Width/5;

            this._rightDusts[this._dustIndex].Reset(rightb);

            this._dustIndex = (this._dustIndex+1) % this._leftDusts.length;
        }
    }

    public IsSelected():boolean{
        return this.GetCurrentSprites()[Archive.selectionUnit].alpha === 1;
    }

    public SetSelected(visible:boolean):void{
        this.SetProperty(Archive.selectionUnit,(e)=>e.alpha= visible ? 1 : 0);
        if(!visible){
            this._visibleHandlers.forEach(h=>h(this));
        }
    }

    public GetNextCeil(): Ceil {
        return this._nextCeil;
    }

    public MoveNextCeil(): void {
        var previousCeil = this._currentCeil;

        this._currentCeil = this._nextCeil;
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

    public Destroy():void{
        super.Destroy();
        this._currentCeil.SetOccupier(null);
        if(!isNullOrUndefined(this._nextCeil))
        {
            this._nextCeil.SetOccupier(null);
        }
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
        this._leftDusts.forEach(ld=>ld.Destroy());
        this._rightDusts.forEach(ld=>ld.Destroy());
        this._leftDusts = [];
        this._rightDusts = [];
    }

    public Update(viewX: number, viewY: number):void{
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

        if(!this.ExistsOrder() || this._order.IsDone() && !this.HasNextCeil()){
            if(this._pendingOrder){
                this._order = this._pendingOrder;
                this._pendingOrder = null;
                this._order.Do(); 
            }
        }

        this._currentCeil.GetField().Support(this); 

        if(this.HasNextCeil())
        {
            this.Moving();
            this.SetCurrentCeilEmpty();
        }
        else
        {
            if(this._pendingOrder)
            {
                this._order = this._pendingOrder;
                this._pendingOrder = null;
            }
        }
        super.Update(viewX,viewY);
    }

    private SetCurrentCeilEmpty() {
        if(this._currentCeil.GetOccupier() === this 
        && this._nextCeil)
        {
            const currentCeilDistance = 
            Math.sqrt(Math.pow(this._currentCeil.GetBoundingBox().X - this.GetBoundingBox().X, 2)
            + Math.pow(this._currentCeil.GetBoundingBox().Y - this.GetBoundingBox().Y, 2));
            const nextCeilDistance = Math.sqrt(Math.pow(this.GetBoundingBox().X - this._nextCeil.GetBoundingBox().X, 2)
            + Math.pow(this.GetBoundingBox().Y - this._nextCeil.GetBoundingBox().Y, 2));

            if (nextCeilDistance < currentCeilDistance) 
            {
                this._currentCeil.SetOccupier(null);
            }
        }
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
