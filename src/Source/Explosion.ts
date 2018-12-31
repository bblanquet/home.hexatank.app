import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";

export class Explosion extends Item{
    BoundingBox:BoundingBox;
    private _timing:number=0;
    private _timeBuffer:number=30;
    private _currentFrame:number=0;
    private _currentAlpha:number=1;

    constructor(boundingbox:BoundingBox)
    {
        super();
        this.Z = 3;
        this.BoundingBox = boundingbox;

        let explosions = ['explosion1.png','explosion2.png','explosion3.png','explosion4.png'];

        explosions.forEach(explosion =>{
            let sprite = new PIXI.Sprite(PlaygroundHelper.Render.Textures[explosion]);
            sprite.pivot.set(sprite.x + sprite.width/2,sprite.y + sprite.height/2);
            sprite.alpha = 0;
            this.DisplayObjects.push(sprite);
        });
        this.IsCentralRef = true;

        PlaygroundHelper.Render.Add(this);
    }

    public Update(viewX: number, viewY: number, zoom: number):void
    {
        super.Update(viewX,viewY,zoom);

        this._timing += 1;

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

        if(this._timing % this._timeBuffer == 0)
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