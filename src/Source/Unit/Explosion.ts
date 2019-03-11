import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { ITimer } from "../Tools/ITimer";
import { Timer } from "../Tools/Timer";

export class Explosion extends Item{
    BoundingBox:BoundingBox;
    private _currentFrame:number=0;
    private _currentAlpha:number=1;
    private _timer:ITimer; 

    constructor(boundingbox:BoundingBox)
    {
        super();
        this.Z = 3;
        this._timer = new Timer(30);
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.X = boundingbox.X;
        this.BoundingBox.Y = boundingbox.Y;
        this.BoundingBox.Width = boundingbox.Width;
        this.BoundingBox.Height = boundingbox.Height;

        let explosions = ['explosion1.png','explosion2.png','explosion3.png','explosion4.png'];
 
        explosions.forEach(explosion =>{
            let sprite = PlaygroundHelper.SpriteProvider.GetSprite(explosion);
            sprite.pivot.set(sprite.x + sprite.width/2,sprite.y + sprite.height/2);
            sprite.alpha = 0;
            this.DisplayObjects.push(sprite);
        });
        this.IsCentralRef = true;

        this.InitPosition(boundingbox);
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);

        if(0 <= this._currentFrame
            && this._currentFrame < this.DisplayObjects.length)
        {
            this.DisplayObjects[this._currentFrame].rotation += 0.005;
            this.DisplayObjects[this._currentFrame].alpha = this._currentAlpha;
        }

        this._currentAlpha -= 0.01;

        if(this._currentAlpha < 0)
        {
            this._currentAlpha = 0;
        }

        if(this._timer.IsElapsed())
        {
            var previous = this._currentFrame;
            this._currentFrame += 1;

            if(this.DisplayObjects.length == this._currentFrame)
            {
                this.DisplayObjects[previous].alpha = 0;
                this.Destroy();
            }
            else
            {
                if(-1 < previous)
                {
                    this.DisplayObjects[previous].alpha = 0;
                }
                this.DisplayObjects[this._currentFrame].alpha = this._currentAlpha;
            }
        }
    }

    private Destroy() {
        this.IsUpdatable = false;
        PlaygroundHelper.Render.Remove(this);
    }

    public GetBoundingBox(): BoundingBox{
        return this.BoundingBox;
    }
    
    public Select(context: InteractionContext): boolean {
        return false;
    }


}