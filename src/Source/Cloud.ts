import { Item } from "./Item";
import { BoundingBox } from "./BoundingBox";
import { InteractionContext } from "./Context/InteractionContext";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { Sprite } from "pixi.js";
import { ITimer } from "./Tools/ITimer";
import { Timer } from "./Tools/Timer";

export class Cloud extends Item{
    private _timer:ITimer;
    IsFading:boolean;
    private _goingRight:boolean = true;
    private _boundingBox:BoundingBox;

    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    } 

    constructor(private _min:number
        , private _max:number
        , private _y:number
        ,private _sprite:string)
    {
        super(); 
        this._timer = new Timer(3);
        this.Z = 4;
        this.DisplayObjects.push(PlaygroundHelper.SpriteProvider.GetSprite(this._sprite));
        this._boundingBox = new BoundingBox();
        this._boundingBox.X = this._min
        this._boundingBox.Y = this._y;
        this._boundingBox.Width = PlaygroundHelper.Settings.Size*3;
        this._boundingBox.Height = PlaygroundHelper.Settings.Size*3;
        this.InitPosition({X:this._min,Y:this._y});
    }

    public Select(context: InteractionContext): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void {
        super.Update(viewX,viewY);
        
        if(this._goingRight){
            if(this._boundingBox.X >= this._max){
                this._goingRight = false;
            }
            else
            {
                this._boundingBox.X += 0.05;
            }
        }

        if(!this._goingRight){
            if(this._boundingBox.X <= this._min){
                this._goingRight = true;
            }
            else
            {
                this._boundingBox.X -= 0.05;
            }
        }
        
        if(this._timer.IsElapsed())
        { 
            if(this.GetSprites()[0].alpha < 0.15)
            {
                this.IsFading = false;
            }

            if(0.9 < this.GetSprites()[0].alpha)
            {
                this.IsFading = true;
            }

            if(this.IsFading)
            {
                this.GetSprites()[0].alpha -= 0.01;
            }

            if(!this.IsFading)
            {
                this.GetSprites()[0].alpha += 0.01;
            }
        }
    }

}