import * as PIXI from 'pixi.js';
import { BoundingBox } from "./BoundingBox";
import { Updater } from "./Updater";
import {InteractionContext} from './Context/InteractionContext';
import { Point } from './Point';
import { IBoundingBoxContainer } from './IBoundingBoxContainer';
import { PlaygroundHelper } from './PlaygroundHelper';

export abstract class Item implements Updater, IBoundingBoxContainer{
    public DisplayObjects:Array<PIXI.DisplayObject>;
    public Z:number;
    public IsUpdatable:Boolean=true;
    protected IsCentralRef:boolean=false;
    constructor()
    {
        this.DisplayObjects = new Array<PIXI.DisplayObject>();
    }

    public abstract GetBoundingBox():BoundingBox;

    public InitPosition(pos:{X:number, Y:number}):void{
        this.GetBoundingBox().X = pos.X;
        this.GetBoundingBox().Y = pos.Y;
        this.DisplayObjects.forEach(displayObj=>{
            displayObj.x = pos.X;
            displayObj.y = pos.Y;
        });
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

    public abstract Select(context:InteractionContext):boolean;
}