import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Explosion } from "./Explosion";
import { AliveItem } from "./AliveItem";

export class Missile extends Item{
    BoundingBox:BoundingBox;
    Target:AliveItem;
    Index:number;
    IsReached:Boolean;
    private _speed:number;
    private _currentMissile:number=0;
    private _damage:number=50;

    constructor(boundingbox:BoundingBox, target:AliveItem)
    {
        super(); 
        this.Target = target;
        this.Z = 2;
        this.BoundingBox = boundingbox;
        this.IsReached = false;
        let missiles = ['missile1.png','missile2.png','missile3.png','missile4.png'];
        var radius = this.GetAngle();

        missiles.forEach(missile =>{
            let sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures[missile]);
            sprite.pivot.set(sprite.x + sprite.width/2,sprite.y + sprite.height/2);
            sprite.alpha = 0;
            this.DisplayObjects.push(sprite);
        });
        this.IsCentralRef = true;

        this._speed = 3;

        PlaygroundHelper.Render.Add(this);

        this.Rotate(radius);
    }

    public Rotate(radius:number):void{
        this.DisplayObjects.forEach(sprite =>{
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

    public Update(viewX: number, viewY: number, zoom: number):void
    {
        super.Update(viewX,viewY,zoom);

        if(!this.IsReached)
        {
            this.IsReached = this.IsTargetReached();
        }

        if(!this.IsReached)
        {
            var angle = this.GetAngle();
            var speedX = -this._speed*Math.cos(angle);
            var speedY = this._speed*Math.sin(angle);
    
            this.GetBoundingBox().X += speedY*2;
            this.GetBoundingBox().Y += speedX*2;
    
            this.DisplayObjects[this._currentMissile].alpha = 0;
            this._currentMissile = (this._currentMissile+1) % this.DisplayObjects.length;
            this.DisplayObjects[this._currentMissile].alpha = 1;
        }
        else
        {
            this.Target.SetDamage(this._damage); 
            let explosion = new Explosion(this.Target.GetBoundingBox());
            PlaygroundHelper.Playground.Items.push(explosion);
            this.Destroy();
        }
    };


    private Destroy() {
        PlaygroundHelper.Render.Remove(this);
        this.IsUpdatable = false;
    }
}