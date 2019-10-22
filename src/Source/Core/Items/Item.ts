import * as PIXI from 'pixi.js';
import { BoundingBox } from "../Utils/BoundingBox";
import { Updater } from "../Updater";
import { Point } from '../Utils/Point';
import { IBoundingBoxContainer } from '../IBoundingBoxContainer';
import { PlaygroundHelper } from '../Utils/PlaygroundHelper';
import { IInteractionContext } from '../Context/IInteractionContext';

export abstract class Item implements Updater, IBoundingBoxContainer{
    private DisplayObjects:Array<PIXI.DisplayObject>;
    public Z:number;
    public IsUpdatable:Boolean=true;
    protected IsCentralRef:boolean=false;
    private _zoomIn:{ [id: string]: PIXI.Sprite; } = {};
    private _zoomOut:{ [id: string]: PIXI.Sprite; } = {};
    protected Accuracy:number=0.5;
    constructor()
    {
        this.DisplayObjects = new Array<PIXI.DisplayObject>();
        PlaygroundHelper.Settings.ScaleSubscribe(this.OnScaleChanged.bind(this));
    }

    public GetCurrentSprites():{ [id: string]: PIXI.Sprite; }{
        return PlaygroundHelper.Settings.isZoomIn() ?
        this._zoomIn :
        this._zoomOut;
    }

    public GetDisplayObjects():Array<PIXI.DisplayObject>{
        return this.DisplayObjects;
    }
    public Clear():void{
        this.DisplayObjects = [];
    }

    protected GetBothSprites(name:string):Array<PIXI.Sprite>{
        return [this._zoomIn[name], this._zoomOut[name]];
    }

    protected SetProperty(name:string, func:{(sprite:PIXI.Sprite):void}){
        func(this.GetCurrentSprites()[name]);
    }

    protected SetProperties(names:string[], func:{(sprite:PIXI.Sprite):void}){
        names.forEach(name=>func(this.GetCurrentSprites()[name]));
    }

    protected SetBothProperty(name:string, func:{(sprite:PIXI.Sprite):void}){
        func(this._zoomIn[name]);
        func(this._zoomOut[name]);
    }

    public Push(blop:PIXI.Graphics):void{
        this.DisplayObjects.push(blop);
    }

    protected GenerateSprite(name:string, func?:{(sprite:PIXI.Sprite):void}):void
    {
        this._zoomOut[name] = PlaygroundHelper.SpriteProvider.GetZoomOutSprite(name,this.Accuracy);
        this._zoomIn[name] = PlaygroundHelper.SpriteProvider.GetZoomInSprite(name,this.Accuracy);
        
        this.DisplayObjects.push(this._zoomOut[name]);
        this.DisplayObjects.push(this._zoomIn[name]);

        if(PlaygroundHelper.Settings.isZoomIn()){
            this._zoomIn[name].alpha = 1;
            this._zoomOut[name].alpha = 0;
        }else{
            this._zoomIn[name].alpha = 0;
            this._zoomOut[name].alpha = 1;
        }

        if(func){
            this.SetBothProperty(name,func);
        }
    }

    private OnScaleChanged(isZoomIn:boolean){
        if(isZoomIn)
        {
            for (let key in this._zoomIn) {
                this._zoomIn[key].alpha = this._zoomOut[key].alpha;
                this._zoomOut[key].alpha = 0;
            }
        }
        else if(!isZoomIn)
        {
            for (let key in this._zoomIn) {
                this._zoomOut[key].alpha = this._zoomIn[key].alpha;
                this._zoomIn[key].alpha = 0;
            }
        }
    }

    public  Destroy():void{
        PlaygroundHelper.Settings.ScaleUnsubscribe(this.OnScaleChanged.bind(this));
    }

    public abstract GetBoundingBox():BoundingBox;

    public InitPosition(pos:{X:number, Y:number}):void{
        this.GetBoundingBox().X = pos.X;
        this.GetBoundingBox().Y = pos.Y;
        this.DisplayObjects.forEach(displayObj=>{
            displayObj.x = pos.X;
            displayObj.y = pos.Y;
        });
        if(this.GetCurrentSprites() === this._zoomIn){
            for (let key in this._zoomOut) {
                this._zoomOut[key].alpha = 0;
            }
        }else{
            for (let key in this._zoomIn) {
                this._zoomIn[key].alpha = 0;
            }
        }

        PlaygroundHelper.Render.Add(this);
    }

    public Update(viewX: number, viewY: number): void
    {
        var ref = this.GetRef();
        this.DisplayObjects.forEach(obj => {
            obj.x = (ref.X + viewX);
            obj.y = (ref.Y + viewY);
        });
        this.GetSprites().forEach(sprite=>{
            sprite.width = this.GetBoundingBox().Width;
            sprite.height =  this.GetBoundingBox().Height;
        });
    }

    protected GetRef():Point
    {
        if(this.IsCentralRef)
        {
            return this.GetBoundingBox().GetCentralPoint();
        }
        return this.GetBoundingBox().GetPosition();
    }

    public GetSprites():Array<PIXI.Sprite>{
        var sprites = new Array<PIXI.Sprite>();
        this.DisplayObjects
        .filter(d => d instanceof PIXI.Sprite)
        .forEach(item=>{sprites.push(<PIXI.Sprite>item)});
        return sprites;
    }

    public abstract Select(context:IInteractionContext):boolean;
}