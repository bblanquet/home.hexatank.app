import {Point} from "./Point";
import {LiteEvent} from "./LiteEvent";
import {InteractionContext} from '../Context/InteractionContext';
import { PlaygroundHelper } from "./PlaygroundHelper";
import * as PIXI from 'pixi.js'; 

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

    public OnMouseDown(event: PIXI.interaction.InteractionEvent):void{
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


    public OnMouseMove(event:PIXI.interaction.InteractionEvent):void{
        if(this.IsGrabbed)
        {
            this.CurrentPoint.X = event.data.global.x;
            this.CurrentPoint.Y = event.data.global.y;
        }
    }

    public OnMouseUp(event:PIXI.interaction.InteractionEvent):void{
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

    // private _minScale:number=0.8;
    // private _maxScale:number=4;

    // public OnPinch(delta:number):void
    // {
    //     let zoom = PlaygroundHelper.Settings.GetScale();
    //     if(delta < 1)
    //     {
    //         zoom -= delta * 0.01;

    //         if(zoom < this._minScale ){
    //             zoom = this._minScale;
    //         }
    //     }
    //     else
    //     {
    //         zoom += delta * 0.01;
            
    //         if(this._maxScale < zoom ){
    //             zoom = this._maxScale;
    //         }
    //     }
    //     PlaygroundHelper.Settings.ChangeScale(zoom);
    // }

    // public OnMouseWheel(value:{deltaY:number}):void{
    //     let zoom = PlaygroundHelper.Settings.GetScale();
    //     if(0 < value.deltaY)//event.wheelDelta
    //     {
    //         zoom -= 0.1;
    //         if(zoom < this._minScale ){
    //             zoom = this._minScale;
    //         }
    //     }
    //     else
    //     {
    //         zoom += 0.1;
    //         if(this._maxScale < zoom ){
    //             zoom = this._maxScale;
    //         }

    //     }
    //     PlaygroundHelper.Settings.ChangeScale(zoom);
    // }
}