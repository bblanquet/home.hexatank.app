import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { IAngleFinder } from "../IAngleFinder";
import { AngleFinder } from "../AngleFinder";
import { IRotatable } from "../IRotatable";
import { IRotationMaker } from "../IRotationMaker";
import { RotationMaker } from "../RotationMaker";
import { HqSkin } from "../HqSkin";
import { ITimer } from "../Tools/ITimer";
import { Timer } from "../Tools/Timer";
import { Archive } from "../Tools/ResourceArchiver";

export class Turrel extends Item implements IRotatable
{
    RotationSpeed: number=0.05;
    CurrentRadius: number;
    GoalRadius: number;
    Base:Tank;
    private _top:string;
    private _canon:Array<string>;
    private _currentCanon:number=0;

    private _animationTimer:ITimer;//5
    //100
    private _coolingDownTimer:ITimer;
    
    IsAnimated:boolean=false;
    IsCanonOverHeat:boolean=false;
    Radius:number;

    private _angleFinder:IAngleFinder;
    private _rotationMaker:IRotationMaker;
    private _skin:HqSkin;

    constructor(hqSkin:HqSkin, item:Tank){
        super();
        this._skin = hqSkin; 
        this.CurrentRadius = 0;
        this.Z = 3;
        this.Base = item;
        this.Radius = 0;
        this._coolingDownTimer = new Timer(100);
        this._animationTimer = new Timer(5);

        
        this._canon = new Array<string>();
        Archive.cannons.forEach(cannon =>{
            this.GenerateSprite(cannon,e=>{
                e.alpha = 0;
            });
            this._canon.push(cannon);
        });

        this.SetProperty(Archive.cannons[0],e=>e.alpha = 1);
        this._top = this._skin.GetTopTankSprite();        
        this.GenerateSprite(this._top);

        this.GetSprites().forEach(sprite => {
            sprite.width = this.Base.GetBoundingBox().Width,
            sprite.height = this.Base.GetBoundingBox().Height
            sprite.anchor.set(0.5);
        });
        this.IsCentralRef = true;
        this._rotationMaker = new RotationMaker<Turrel>(this);
        this._angleFinder = new AngleFinder<Turrel>(this);
    }

    public GetBoundingBox(): BoundingBox {
        return this.Base.GetBoundingBox();
    }    

    public Update(viewX: number, viewY: number):void{
        super.Update(viewX,viewY);
        this.Action();
    }

    private Action():void
    {
        var isTargetReached = this.Rotating();

        if(this.IsCanonOverHeat)
        {
            this.CoolingDown();
        }
        else
        {
            if(!this.IsAnimated && isTargetReached)
            {
                this.Shoot();
            }
    
            this.CanonAnimation();
        }
    }

    private Shoot() {
        this.IsAnimated = true;
        var missile = new Missile(
            BoundingBox.Create(this.GetBoundingBox().X,this.GetBoundingBox().Y,this.GetBoundingBox().Width,this.GetBoundingBox().Height)
            , this.Base.GetTarget()
            , this.Base.Attack);
        PlaygroundHelper.Playground.Items.push(missile);
    }

    private CoolingDown():void {
        if (this._coolingDownTimer.IsElapsed()) 
        {
            this.IsCanonOverHeat = false;
        }
    }

    private CanonAnimation():void
    {    
        if(this.IsAnimated)
        {
            if(this._animationTimer.IsElapsed())
            {    
                this.GetCurrentSprites()[this._canon[this._currentCanon]].alpha = 0;
                this._currentCanon = (1+this._currentCanon)%this._canon.length;
                this.GetCurrentSprites()[this._canon[this._currentCanon]].alpha =  1;

                if(this._currentCanon == 0)
                {
                    this.IsAnimated = false;
                    this.IsCanonOverHeat = true;
                }
            }
        }
    }

    public Rotate(radius:number):void{
        this.GetSprites().forEach(sprite =>{
            sprite.rotation = radius;
        }) ;
        this.Radius = radius;
    }
    
    public Select(context: InteractionContext): boolean {
        //nothing to do
        return false;
    }

    private Rotating():boolean{
        if(this.Base.GetTarget() != null)
        {
            this._angleFinder.SetAngle(this.Base.GetTarget());
    
            if(this.CurrentRadius !== this.GoalRadius)
            {
                this._rotationMaker.Rotate();
                this.Rotate(this.CurrentRadius);
            }

            return this.CurrentRadius === this.GoalRadius;
        }
        return false;
    };

}