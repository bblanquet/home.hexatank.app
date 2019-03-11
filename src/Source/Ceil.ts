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
import { AliveItem } from './AliveItem';
import { BasicField } from './Field/BasicField';
import { CeilState } from './CeilState';
import { isNullOrUndefined } from 'util';

export class Ceil extends Item implements ICeil
{
    private _state:CeilState = CeilState.Hidden;
    Properties:CeilProperties;
    private _display:{ [id: number]: Array<PIXI.Sprite>; };
    private _field:IField;
    private _occupier:IMovable;
    DecorationSprite:PIXI.Sprite;

    constructor(properties:CeilProperties)
    {
        super();
        this.Z= 1;
        this._display = [];
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
        if(!isNullOrUndefined(this._field)){
            PlaygroundHelper.Render.Remove(<Item> <any> this._field);
        }

        this._field = field;
    }

    public GetOccupier():IMovable{
        return this._occupier;
    } 

    public SetOccupier(movable:IMovable){
        this._occupier = movable;
    }

    public IsBlocked():boolean{
        return (!isNullOrUndefined(this._field) && this._field.IsBlocking()) 
                || this._occupier != null;
    }

    public IsShootable():boolean{
        return (this._field.IsDesctrutible()) || this._occupier != null;
    }

    public GetShootableEntity():AliveItem{
        if(!isNullOrUndefined(this._field)){
            if(this._field.IsDesctrutible()){
                return <AliveItem> <any> this._field;
            }
        }

        if(this._occupier != null){
            return <AliveItem>(this._occupier as any);
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

        this._state = state;

        this._display[this._state].forEach(sprite=>{
            sprite.alpha = 1;
        })
    }

    public AddSprite(sprite:PIXI.Sprite){
        this._areaSprite = sprite;
        this._areaSprite.alpha = 0.2;
        this._areaSprite.x = this.GetBoundingBox().X;
        this._areaSprite.y = this.GetBoundingBox().Y;
        this.DisplayObjects.push(this._areaSprite);
        PlaygroundHelper.Render.AddDisplayableEntity(this._areaSprite);
    }

    private _areaSprite:PIXI.Sprite;

    public SetDecoration(sprite:PIXI.Sprite):void{
        this.DecorationSprite = sprite;
        this.DecorationSprite.alpha = 0;
    }

    public SetSprite():void
    {
        let hiddenCeil = PlaygroundHelper.SpriteProvider.GetSprite("./hiddenCell.svg");
        hiddenCeil.alpha = 1;
        let halfCeil = PlaygroundHelper.SpriteProvider.GetSprite("./halfVisibleCell.svg");
        halfCeil.alpha = 0;
        let ceil = PlaygroundHelper.SpriteProvider.GetSprite('./cell.svg');   
        ceil.alpha = 0;

        this._display[CeilState.Hidden] = [hiddenCeil];
        
        if(isNullOrUndefined(this.DecorationSprite))
        {
            this._display[CeilState.HalfVisible] = [halfCeil,ceil]; 
            this._display[CeilState.Visible] = [ceil];      
        }
        else
        {
            this._display[CeilState.HalfVisible] = [halfCeil,this.DecorationSprite,ceil];         
            this._display[CeilState.Visible] = [this.DecorationSprite,ceil];         

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