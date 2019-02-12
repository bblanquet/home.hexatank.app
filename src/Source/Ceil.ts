import * as PIXI from 'pixi.js';
import {Item} from './Item';
import {InteractionContext} from './Context/InteractionContext';
import {CeilProperties} from './CeilProperties';
import {ICeil} from './ICeil';
import { HexAxial } from "./Coordinates/HexAxial";
import {Point} from './Point';
import {PlaygroundHelper} from './PlaygroundHelper';
import { BoundingBox } from "./BoundingBox";
import { IField } from 'Field/IField';
import { IMovable } from './IMovable';
import { Diamond } from './Field/Diamond';
import { AliveItem } from './AliveItem';
import { BasicField } from './Field/BasicField';
import { CeilState } from './CeilState';
import { isNullOrUndefined } from 'util';

export class Ceil extends Item implements ICeil
{
    State:CeilState = CeilState.Hidden;
    Properties:CeilProperties;
    Sprites:{ [id: number]: Array<PIXI.Sprite>; };
    private _field:IField;
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

    public GetField():IField{
        return this._field;
    }

    public DestroyField(){
        new BasicField(this);
    }

    public SetField(field:IField){
        this._field = field;
    }

    public GetMovable():IMovable{
        return this._movable;
    } 

    public SetMovable(movable:IMovable){
        this._movable = movable;
    }

    public IsBlocked():boolean{
        return (!isNullOrUndefined(this._field) && this._field.IsBlocking()) 
                || this._movable != null;
    }

    public IsShootable():boolean{
        return (this._field.IsDesctrutible()) || this._movable != null;
    }

    public GetShootableEntity():AliveItem{
        if(!isNullOrUndefined(this._field)){
            if(this._field.IsDesctrutible()){
                return <AliveItem> <any> this._field;
            }
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

        if(!isNullOrUndefined(this._areaSprite))
        {
            this._areaSprite.alpha = 0.2;
        }

        this.State = state;

        this.Sprites[this.State].forEach(sprite=>{
            sprite.alpha = 1;
        })
    }

    public AddSprite(sprite:PIXI.Sprite){
        this._areaSprite = sprite;
        this._areaSprite.alpha = 0.2;
        this.DisplayObjects.push(this._areaSprite);
        PlaygroundHelper.Render.AddDisplayableEntity(this._areaSprite);
    }

    private _areaSprite:PIXI.Sprite;

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
            console.log(`%c Q:${this.GetCoordinate().Q} R:${this.GetCoordinate().R}`,'color:blue;font-weight:bold;');
            context.OnSelect(this);
        }

        return false;
    }
}