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
    private _explosions:Array<string>;

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

        this._explosions = ['explosion1.png','explosion2.png','explosion3.png','explosion4.png'];
 
        this._explosions.forEach(explosion =>{
            this.GenerateSprite(explosion, e=>{
                e.anchor.set(0.5);
                e.alpha = 0;
            })
        });
        this.IsCentralRef = true;

        this.InitPosition(boundingbox);
    }

    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);

        if(0 <= this._currentFrame
            && this._currentFrame < this._explosions.length)
        {
            this.GetCurrentSprites()[this._explosions[this._currentFrame]].rotation += 0.005;
            this.GetCurrentSprites()[this._explosions[this._currentFrame]].alpha = this._currentAlpha;
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

            if(this._explosions.length == this._currentFrame)
            {
                this.GetCurrentSprites()[this._explosions[previous]].alpha = 0;
                this.Destroy();
            }
            else
            {
                if(-1 < previous)
                {
                    this.GetCurrentSprites()[this._explosions[previous]].alpha = 0;
                }
                this.GetCurrentSprites()[this._explosions[this._currentFrame]].alpha = this._currentAlpha;
            }
        }
    }

    public  Destroy() {
        super.Destroy();
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