import * as PIXI from 'pixi.js';
import {Item} from './Item';
import {InteractionContext} from './InteractionContext';
import {CeilProperties} from './CeilProperties';
import {ICeil} from './ICeil';
import { HexAxial } from "./Coordinates/HexAxial";
import {Point} from './Point';
import {PlaygroundHelper} from './PlaygroundHelper';
import { BoundingBox } from "./BoundingBox";
import { IField } from './IField';
import { RockField } from './RockField';
import { IMovable } from './IMovable';
import { Diamond } from './Diamond';
import { AliveItem } from './AliveItem';

export class Ceil extends Item implements ICeil
{
    Properties:CeilProperties;
    Sprite:PIXI.Sprite;
    SelectedSprite:PIXI.Sprite;
    private _pathSprite:PIXI.Sprite;
    DisplayObjects:Array<PIXI.Sprite>;
    Field:IField;
    private _movable:IMovable;

    constructor(properties:CeilProperties)
    {
        super();
        this.Z= 1;
        this.Properties = properties;
    }

    public GetMovable():IMovable{
        return this._movable;
    } 

    public SetMovable(movable:IMovable){
        this._movable = movable;
        if(this._movable == null)
        {
            this._pathSprite.alpha = 0;
            this.SelectedSprite.alpha = 0;
        }
        else
        {
            this._pathSprite.alpha = 1; 
        }
    }

    public IsBlocked():boolean{
        return (this.Field != null && (this.Field instanceof RockField ||this.Field instanceof Diamond)) || this._movable != null;
    }

    public IsShootable():boolean{
        return (this.Field instanceof RockField) || this._movable != null;
    }

    public GetShootableEntity():AliveItem{
        if(this.Field instanceof RockField) {
            return <RockField> this.Field;
        }

        if(this._movable != null){
            return <AliveItem>(this._movable as any);
        }

        return null;
    }

    public GetBoundingBox():BoundingBox{
        return this.Properties.BoundingBox;
    }

    public Decorate(textures : PIXI.loaders.TextureDictionary):void{
        this.Sprite = new PIXI.Sprite(textures["ceil.png"]);
        
        this.SelectedSprite = new PIXI.Sprite(textures["selectedCeil.png"]);
        this.SelectedSprite.alpha = 0;

        this._pathSprite = new PIXI.Sprite(textures["pathCeil.png"]);
        this._pathSprite.alpha = 0;

        this.DisplayObjects = new Array<PIXI.Sprite>();
        this.DisplayObjects.push(this.SelectedSprite);
        this.DisplayObjects.push(this._pathSprite);
        this.DisplayObjects.push(this.Sprite);

        this.DisplayObjects.forEach(sprite =>{
            sprite.interactive = true;
        });
    }

    public GetCoordinate():HexAxial{
        return this.Properties.Coordinate;
    }

    public GetCentralPoint():Point{
        return this.Properties.GetCentralPoint();
    }

    public GetAllNeighbourhood():Array<ICeil>{
        var ceils = new Array<ICeil>();
        this.GetCoordinate().GetNeighbours().forEach(coordinate => {
            var ceil = PlaygroundHelper.CeilsContainer.Get(coordinate);
            if(ceil != null)
            {
                ceils.push(ceil);
            }
        });
        return ceils;
    }

    public GetNeighbourhood():Array<ICeil>{
        var ceils = new Array<ICeil>();
        this.GetCoordinate().GetNeighbours().forEach(coordinate => {
            var ceil = PlaygroundHelper.CeilsContainer.Get(coordinate);
            if(ceil != null && !ceil.IsBlocked())
            {
                ceils.push(ceil);
            }
        });
        return ceils;
    }

    public SetPathStatus(isDisplayed:boolean):void
    {
        if(isDisplayed)
        {
            this.SelectedSprite.alpha = 1;
        }
        else
        {
            this.SelectedSprite.alpha = 0;
        }
    }

    public Select(context:InteractionContext):boolean
    {
        var isSelected = this.Sprite.containsPoint(context.Point);
        
        if(isSelected)
        {
            console.log(`%c Q:${this.GetCoordinate().Q} R:${this.GetCoordinate().R}`,'color:purple;font-weight:bold;')
            context.OnSelect(this);
        }

        return false;
    }
}