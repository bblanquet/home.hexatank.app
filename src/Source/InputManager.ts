import {Point} from "./Point";
import {LiteEvent} from "./LiteEvent";
import {InteractionContext} from './Context/InteractionContext';
import { PlaygroundHelper } from "./PlaygroundHelper";

export class InputManager{
    IsGrabbed:Boolean;
    CurrentPoint:Point;
    DownPoint:Point;
    DownEvent:LiteEvent<InteractionContext>;
    InteractionContext:InteractionContext;

    constructor(interactionContext:InteractionContext){
        this.IsGrabbed = false;
        this.CurrentPoint = new Point(0,0);
        this.DownPoint = new Point(0,0);
        this.DownEvent = new LiteEvent<InteractionContext>();
        this.InteractionContext = interactionContext;
    }

    OnMouseDown(event: PIXI.interaction.InteractionEvent){
        if(!this.IsGrabbed)
        {
            this.CurrentPoint.X = event.data.global.x;
            this.CurrentPoint.Y = event.data.global.y;
            this.DownPoint.X = event.data.global.x;
            this.DownPoint.Y = event.data.global.y;
            this.IsGrabbed = true;
            this.InteractionContext.Point = event.data.global;
        }
    }    

    OnMouseMove(event:PIXI.interaction.InteractionEvent){
        if(this.IsGrabbed)
        {
            PlaygroundHelper.Settings.SetX(
                PlaygroundHelper.Settings.GetX()
                + event.data.global.x 
                - this.CurrentPoint.X);
            
            PlaygroundHelper.Settings.SetY(
                    PlaygroundHelper.Settings.GetY()
                    + event.data.global.y 
                    - this.CurrentPoint.Y);


            this.CurrentPoint.X = event.data.global.x;
            this.CurrentPoint.Y = event.data.global.y;
        }
    }

    OnMouseUp(event:PIXI.interaction.InteractionEvent){
        this.IsGrabbed = false;
        const distance = Math.abs(
            Math.sqrt(
                  Math.pow(event.data.global.x - this.DownPoint.X,2) 
                + Math.pow(event.data.global.y - this.DownPoint.Y,2)));
        
        if(distance < PlaygroundHelper.Settings.Size/3)
        {
            this.DownEvent.trigger(this.InteractionContext);
        }
    }

    private _minScale:number=0.8;
    private _maxScale:number=2;

    OnPinch(delta:number):void
    {
        let zoom = PlaygroundHelper.Settings.GetScale();
        if(delta < 1)
        {
            zoom -= delta * 0.01;

            if(zoom < this._minScale ){
                zoom = this._minScale;
            }
        }
        else
        {
            zoom += delta * 0.01;
            
            if(this._maxScale < zoom ){
                zoom = this._maxScale;
            }
        }
        PlaygroundHelper.Settings.ChangeScale(zoom);
    }

    OnMouseWheel(value:{deltaY:number}):void{
        let zoom = PlaygroundHelper.Settings.GetScale();
        if(0 < value.deltaY)//event.wheelDelta
        {
            zoom -= 0.1;
            if(zoom < this._minScale ){
                zoom = this._minScale;
            }
        }
        else
        {
            zoom += 0.1;
            if(this._maxScale < zoom ){
                zoom = this._maxScale;
            }

        }
        PlaygroundHelper.Settings.ChangeScale(zoom);
    }
}