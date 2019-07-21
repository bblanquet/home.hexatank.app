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
            console.log(`X ${event.data.global.x} Y ${event.data.global.y}`)
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
}