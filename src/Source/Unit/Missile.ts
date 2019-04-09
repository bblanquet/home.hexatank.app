import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Explosion } from "./Explosion";
import { AliveItem } from "../AliveItem";
import { Archive } from "../Tools/ResourceArchiver";

export class Missile extends Item{
    BoundingBox:BoundingBox;
    Target:AliveItem;
    Index:number; 
    IsReached:Boolean;
    private _speed:number;
    private _currentMissile:number=0;

    constructor(boundingbox:BoundingBox, target:AliveItem, private _damage:number)
    {
        super(); 
        this.Target = target;
        this.Z = 2;
        this.BoundingBox = boundingbox;
        this.IsReached = false;
        var radius = this.GetAngle();

        Archive.missiles.forEach(missile =>{
            this.GenerateSprite(missile,e=>{
                e.alpha = 0;
            });
        });

        this.GetSprites().forEach(sprite => {
            sprite.width = this.BoundingBox.Width,
            sprite.height = this.BoundingBox.Height
            sprite.anchor.set(0.5);
        });

        this.IsCentralRef = true;

        this._speed = 3;

        this.InitPosition(this.BoundingBox);
        this.Rotate(radius);
    }

    public Rotate(radius:number):void{
        this.GetSprites().forEach(sprite =>{
            sprite.rotation = radius;
        }) ;
    }

    public GetBoundingBox(): BoundingBox{
        return this.BoundingBox;
    }
    
     public Select(context: InteractionContext): boolean {
        return false;
    }

    private IsTargetReached ():boolean{
        if(Math.abs((this.Target.GetBoundingBox().GetCenter()) - this.BoundingBox.GetCenter()) < PlaygroundHelper.Settings.Size/5
            && Math.abs((this.Target.GetBoundingBox().GetMiddle()) - this.BoundingBox.GetMiddle()) < PlaygroundHelper.Settings.Size/5)
        {
            return true;
        }else
        {
            return false;
        }
    };

    private GetAngle():number{
        var aPoint = new PIXI.Point(this.BoundingBox.GetCenter(), this.BoundingBox.GetMiddle());
        var bPoint = new PIXI.Point(this.BoundingBox.GetCenter(), this.BoundingBox.GetMiddle() + 1);
        var cPoint = new PIXI.Point(this.Target.GetBoundingBox().GetCenter(), this.Target.GetBoundingBox().GetMiddle());
        var radius = Math.atan2(cPoint.y - bPoint.y, cPoint.x - bPoint.x) - Math.atan2(aPoint.y - bPoint.y, aPoint.x - bPoint.x);
        return radius;
    };

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);

        if(!this.IsReached)
        {
            this.IsReached = this.IsTargetReached();
        }

        if(!this.IsReached)
        {
            var angle = this.GetAngle();
            var speedX = -this._speed*Math.cos(angle);
            var speedY = this._speed*Math.sin(angle);
    
            this.GetBoundingBox().X += speedY*1.5;
            this.GetBoundingBox().Y += speedX*1.5;
    
            this.GetCurrentSprites()[Archive.missiles[this._currentMissile]].alpha = 0;
            this._currentMissile = (this._currentMissile+1) % Archive.missiles.length;
            this.GetCurrentSprites()[Archive.missiles[this._currentMissile]].alpha = 1;
        }
        else
        {
            this.Target.SetDamage(this._damage); 
            let explosion = new Explosion(this.Target.GetBoundingBox());
            PlaygroundHelper.Playground.Items.push(explosion);
            this.Destroy();
        }
    };


    public  Destroy() {
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
    }
}