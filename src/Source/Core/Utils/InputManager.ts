import {Point} from "./Point";
import {LiteEvent} from "./LiteEvent";
import {InteractionContext} from '../Context/InteractionContext';
import { PlaygroundHelper } from "./PlaygroundHelper";
import * as PIXI from 'pixi.js'; 

export class InputManager{
    private _isGrabbed:Boolean;
    private _currentPoint:Point;
    private _downPoint:Point;
    public MouseUpEvent:LiteEvent<InteractionContext>;

    public InteractionContext:InteractionContext;
    private _touchDuration = 500;
    private _timerOut:NodeJS.Timeout;

    private _isHolding:boolean;
    public HoldingStartedEvent:LiteEvent<Point>;
    public HoldingStoppedEvent:LiteEvent<Point>;
    public MovingEvent:LiteEvent<Point>;

    constructor(interactionContext:InteractionContext){
        this._isGrabbed = false;
        this._currentPoint = new Point(0,0);
        this._downPoint = new Point(0,0);
        this.MouseUpEvent = new LiteEvent<InteractionContext>();
        this.MovingEvent = new LiteEvent<Point>();
        this.HoldingStartedEvent = new LiteEvent<Point>();
        this.HoldingStoppedEvent = new LiteEvent<Point>();
        this.InteractionContext = interactionContext;
    }

    public OnMouseDown(event: PIXI.interaction.InteractionEvent):void{
        if(!this._isGrabbed)
        {
            this._currentPoint.X = event.data.global.x;
            this._currentPoint.Y = event.data.global.y;
            this._downPoint.X = event.data.global.x;
            this._downPoint.Y = event.data.global.y;
            this._isGrabbed = true;
            console.log(`X ${event.data.global.x} Y ${event.data.global.y}`)
            this.InteractionContext.Point = event.data.global;
            if(this._timerOut){
                clearTimeout(this._timerOut);
            }
            this._timerOut = setTimeout(this.OnLongTouch.bind(this), this._touchDuration); 
        }
    }    

    private OnLongTouch():void{
        if(this._timerOut){
            clearTimeout(this._timerOut);
        }
        const distance = Math.abs(
            Math.sqrt(
                  Math.pow(this._currentPoint.X - this._downPoint.X,2) 
                + Math.pow(this._currentPoint.Y - this._downPoint.Y,2)));
        if(distance < PlaygroundHelper.Settings.Size/3)
        {
            PlaygroundHelper.PauseNavigation();
            this._isGrabbed = false;
            this._isHolding = true;
            this.HoldingStartedEvent.trigger(this._currentPoint);
        }
    }

    public OnMouseMove(event:PIXI.interaction.InteractionEvent):void{
        if(this._isGrabbed || this._isHolding)
        {
            this._currentPoint.X = event.data.global.x;
            this._currentPoint.Y = event.data.global.y;
        }
        this.MovingEvent.trigger(new Point(event.data.global.x,event.data.global.y));
    }

    public OnMouseUp(event:PIXI.interaction.InteractionEvent):void{

        if(this._timerOut)
        {
            clearTimeout(this._timerOut);
        }
        
        if(this._isHolding)
        {
            this._isHolding = false;
            this.HoldingStoppedEvent.trigger(this._currentPoint);
            PlaygroundHelper.RestartNavigation();
        }

        if(this._isGrabbed)
        {
            this._isGrabbed = false;
            const distance = Math.abs(
                Math.sqrt(
                      Math.pow(event.data.global.x - this._downPoint.X,2) 
                    + Math.pow(event.data.global.y - this._downPoint.Y,2)));
            
            if(distance < PlaygroundHelper.Settings.Size/3)
            {
                this.MouseUpEvent.trigger(this.InteractionContext);
            }
        }
    }
}