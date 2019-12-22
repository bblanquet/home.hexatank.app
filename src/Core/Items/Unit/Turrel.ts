import { Item } from "../Item";
import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { IAngleFinder } from "./Utils/IAngleFinder";
import { AngleFinder } from "./Utils/AngleFinder";
import { IRotatable } from "./Utils/IRotatable";
import { IRotationMaker } from "./Utils/IRotationMaker";
import { RotationMaker } from "./Utils/RotationMaker"; 
import { ITimer } from "../../Utils/ITimer";
import { HqSkin } from "../../Utils/HqSkin";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { Timer } from "../../Utils/Timer";
import { Archive } from "../../Utils/ResourceArchiver";
import { BoundingBox } from "../../Utils/BoundingBox";
import { InteractionContext } from "../../Context/InteractionContext";
import { GameSettings } from "../../Utils/GameSettings";

export class Turrel extends Item implements IRotatable 
{
    RotationSpeed: number;
    CurrentRadius: number;
    GoalRadius: number;
    Base:Tank;
    private _top:string;
    private _currentCanon:number=0;

    private _animationTimer:ITimer;
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
        this.RotationSpeed = GameSettings.TurrelRotationSpeed;
        this.CurrentRadius = 0;
        this.Z = 3;
        this.Base = item;
        this.Radius = 0;
        this._coolingDownTimer = new Timer(100);
        this._animationTimer = new Timer(5);

        
        Archive.cannons.forEach(cannon =>{
            this.GenerateSprite(cannon,e=>{
                e.alpha = 0;
            });
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
        if(!this.Base.HasCamouflage){
            var isTargetReached = this.Rotating();
        }

        if(this.IsCanonOverHeat)
        {
            this.CoolingDown();
        }
        else
        {
            if(!this.Base.HasCamouflage){
                if(!this.IsAnimated && isTargetReached)
                {
                    this.Shoot();
                }
        
                this.CanonAnimation();
            }
        }
    }

    private Shoot() {
        this.IsAnimated = true;
        const missile = new Missile(
            BoundingBox.Create(this.GetBoundingBox().X,this.GetBoundingBox().Y,this.GetBoundingBox().Width,this.GetBoundingBox().Height)
            , this.Base.GetTarget()
            , this.Base.Attack);
        missile.GetSprites().forEach(s=>s.visible = this.Base.GetCurrentCeil().IsVisible());
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
                this.GetCurrentSprites()[Archive.cannons[this._currentCanon]].alpha = 0;
                this._currentCanon = (1+this._currentCanon)%Archive.cannons.length;
                this.GetCurrentSprites()[Archive.cannons[this._currentCanon]].alpha =  1;

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