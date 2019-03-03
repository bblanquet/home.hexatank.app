import { Point } from "./Point";
import { ViewContext } from "./ViewContext";
import {LiteEvent} from "./LiteEvent";
import {InteractionContext} from './Context/InteractionContext';

export class InputManager{
    IsGrabbed:Boolean;
    CurrentPoint:Point;
    ViewContext:ViewContext;
    DownEvent:LiteEvent<InteractionContext>;
    InteractionContext:InteractionContext;

    constructor(viewContext:ViewContext){
        this.IsGrabbed = false;
        this.ViewContext = viewContext;
        this.CurrentPoint = new Point(0,0);
        this.DownEvent = new LiteEvent<InteractionContext>();
        this.InteractionContext = new InteractionContext();
    }

    OnMouseDown(event: PIXI.interaction.InteractionEvent){
        //console.log(`typeof ${typeof event}`,'color:purple;');
        if(!this.IsGrabbed)
        {
            this.CurrentPoint.X = event.data.global.x;
            this.CurrentPoint.Y = event.data.global.y;
            this.IsGrabbed = true;
            this.InteractionContext.Point = event.data.global;
            this.DownEvent.trigger(this.InteractionContext);
        }
    }    

    OnMouseMove(event:PIXI.interaction.InteractionEvent){
        //console.log(`%c move x: ${event.data.global.x} y: ${event.data.global.x}`,'color:green;');
        if(this.IsGrabbed)
        {
            this.ViewContext.BoundingBox.X += 
            event.data.global.x - this.CurrentPoint.X;
            
            this.ViewContext.BoundingBox.Y += 
            event.data.global.y - this.CurrentPoint.Y;

            this.CurrentPoint.X = event.data.global.x;
            this.CurrentPoint.Y = event.data.global.y;
        }
    }

    OnMouseUp(event:PIXI.interaction.InteractionEvent){
        //console.log("up");
        this.IsGrabbed = false;
    }

    OnPinch(delta:number):void{
        if(delta < 1)
        {
            this.ViewContext.Zoom -= delta * 0.01;
        }
        else
        {
            this.ViewContext.Zoom += delta * 0.01;
        }
    }

    OnMouseWheel(value:{deltaY:number}):void{
        if(0 < value.deltaY)//event.wheelDelta
        {
            this.ViewContext.Zoom += 0.1;
        }
        else
        {
            this.ViewContext.Zoom -= 0.1;
        }
    }
}