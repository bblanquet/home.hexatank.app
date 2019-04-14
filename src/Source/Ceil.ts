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
import { Archive } from './Tools/ResourceArchiver';

export class Ceil extends Item implements ICeil
{
    private _state:CeilState = CeilState.Hidden;
    Properties:CeilProperties;
    private _display:{ [id: number]: Array<string>; };
    private _field:IField;
    private _occupier:IMovable;
    private _decorationSprite:string;
    private _areaSprite:string;

    constructor(properties:CeilProperties)
    {
        super();
        this.Z= 1;
        this._display = [];
        this.Properties = properties;
        new BasicField(this);
        this.IsCentralRef = true;
        
        this.GenerateSprite(Archive.selectionCell);
        this.SetProperty(Archive.selectionCell,(e)=>e.alpha=0);
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
            this.SetProperty(this._areaSprite,(e)=>e.alpha = 0.2);
        }

        this._state = state;

        this._display[this._state].forEach(sprite=>{
            this.SetProperty(sprite, (e)=>e.alpha = 1);
        })
    }

    public AddSprite(sprite:string){
        this._areaSprite = sprite;
        this.GenerateSprite(sprite);
        this.SetProperty(sprite,e=>{
            e.alpha = 0.2;
            e.anchor.set(0.5);
            e.x = this.GetBoundingBox().X;
            e.y = this.GetBoundingBox().Y; 
        });
        this.GetBothSprites(this._areaSprite).forEach(s=>{
            PlaygroundHelper.Render.AddDisplayableEntity(s);
        })
    }


    public SetDecoration(sprite:string):void{
        const random = Math.random();
        this.GenerateSprite(sprite,s=>{
            s.alpha = 0;
            s.anchor.set(0.5);
            s.rotation += random * 360;
        });
        this._decorationSprite = sprite;
    }

    public SetSprite():void
    {
        this.GenerateSprite(Archive.hiddenCell,s=>{
            s.anchor.set(0.5);
            s.alpha = 1;
        });

        this.GenerateSprite(Archive.halfVisibleCell,s=>{
            s.anchor.set(0.5);
            s.alpha = 0;
        });

        this.GenerateSprite(Archive.cell,s=>{
            s.anchor.set(0.5);
            s.alpha = 0;
        });

        this._display[CeilState.Hidden] = [Archive.hiddenCell];
        
        if(isNullOrUndefined(this._decorationSprite))
        {
            this._display[CeilState.HalfVisible] = [Archive.halfVisibleCell,Archive.cell]; 
            this._display[CeilState.Visible] = [Archive.cell];      
        }
        else
        {
            this._display[CeilState.HalfVisible] = [Archive.halfVisibleCell,this._decorationSprite,Archive.cell];         
            this._display[CeilState.Visible] = [this._decorationSprite,Archive.cell];         
        }
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