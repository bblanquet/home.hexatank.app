import * as PIXI from 'pixi.js';
import { BoundingBox } from "./BoundingBox";
import { Updater } from "./Updater";
import {InteractionContext} from './InteractionContext';
import { Point } from './Point';
import { IBoundingBoxContainer } from './IBoundingBoxContainer';

export abstract class Item implements Updater, IBoundingBoxContainer{
    DisplayObjects:Array<PIXI.DisplayObject>;
    Z:number;
    IsUpdatable:Boolean=true;
    protected IsCentralRef:boolean=false;
    constructor()
    {
        this.DisplayObjects = new Array<PIXI.DisplayObject>();
    }

    public abstract GetBoundingBox():BoundingBox;

    public Update(viewX: number, viewY: number, zoom: number): void 
    {    
        var ref = this.GetRef();
        this.DisplayObjects.forEach(obj => {
            obj.x = zoom * (ref.X + viewX);
            obj.y = zoom * (ref.Y + viewY);
        });
        this.GetSprites().forEach(sprite=>{
            sprite.width = zoom * this.GetBoundingBox().Width;
            sprite.height = zoom * this.GetBoundingBox().Height;
        });
    }

    private GetRef():Point
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