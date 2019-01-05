import * as PIXI from 'pixi.js';
import {Item} from './Item';
import {InteractionContext} from './Context/InteractionContext';
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
import { BasicField } from './BasicField';
import { CeilState } from './CeilState';
import { isNullOrUndefined } from 'util';

export class Ceil extends Item implements ICeil
{
    State:CeilState = CeilState.Hidden;
    Properties:CeilProperties;
    Sprites:{ [id: number]: Array<PIXI.Sprite>; };
    Field:IField;
    private _movable:IMovable;
    DecorationSprite:PIXI.Sprite;

    constructor(properties:CeilProperties)
    {
        super();
        this.Z= 1;
        this.Sprites = [];
        this.Properties = properties;
        new BasicField(this);
    }

    public GetMovable():IMovable{
        return this._movable;
    } 

    public SetMovable(movable:IMovable){
        this._movable = movable;
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

    public SetState(state:CeilState):void{
        this.GetSprites().forEach(sprite=> sprite.alpha = 0);

        this.State = state;

        this.Sprites[this.State].forEach(sprite=>{
            sprite.alpha = 1;
        })
    }

    public SetDecoration(sprite:PIXI.Sprite):void{
        this.DecorationSprite = sprite;
        this.DecorationSprite.alpha = 0;
    }

    public SetSprite(textures : PIXI.loaders.TextureDictionary):void
    {
        let hiddenCeil = new PIXI.Sprite(textures["hiddenCeil"]);
        hiddenCeil.alpha = 1;
        let halfCeil = new PIXI.Sprite(textures["halfHiddenCeil"]);
        halfCeil.alpha = 0;
        let ceil = new PIXI.Sprite(textures["ceil.png"]);
        ceil.alpha = 0;

        this.Sprites[CeilState.Hidden] = [hiddenCeil];
        
        if(isNullOrUndefined(this.DecorationSprite))
        {
            this.Sprites[CeilState.HalfVisible] = [halfCeil,ceil]; 
            this.Sprites[CeilState.Visible] = [ceil];      
        }
        else
        {
            this.Sprites[CeilState.HalfVisible] = [halfCeil,this.DecorationSprite,ceil];         
            this.Sprites[CeilState.Visible] = [this.DecorationSprite,ceil];         

            this.DisplayObjects.push(this.DecorationSprite);
        }
        
        this.DisplayObjects.push(hiddenCeil);
        this.DisplayObjects.push(halfCeil);
        this.DisplayObjects.push(ceil);
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

    public Select(context:InteractionContext):boolean
    {
        var isSelected = this.GetSprites()[0].containsPoint(context.Point);
        
        if(isSelected)
        {
            //console.log(`%c Q:${this.GetCoordinate().Q} R:${this.GetCoordinate().R}`,'color:purple;font-weight:bold;')
            context.OnSelect(this);
        }

        return false;
    }
}