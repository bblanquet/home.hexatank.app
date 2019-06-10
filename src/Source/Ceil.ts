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
import { ISelectable } from './ISelectable';
import { Headquarter } from './Field/Headquarter';

export class Ceil extends Item implements ICeil , ISelectable
{
    public Properties:CeilProperties;
    private _state:CeilState = CeilState.Hidden;
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
        this.SetBothProperty(Archive.selectionCell,(e)=>{
            e.alpha=0;
            e.anchor.set(0.5);
        });
    }

    public GetState(): CeilState {
        return this._state;
    }

    private _ceilStateHandlers: { (data: CeilState):void }[] = [];

    public RegisterCeilState(handler: (data: CeilState) => void): void {
        this._ceilStateHandlers.push(handler);
    }
    public UnregisterCeilState(handler: (data: CeilState) => void): void {
        this._ceilStateHandlers = this._ceilStateHandlers.filter(h => h !== handler);
    }

    private OnCeilStateChanged(state:CeilState){
        this._state = state;
        this._ceilStateHandlers.forEach(ceilStateHandler=>
        {
            ceilStateHandler(this._state);
        });
    }

    public IsVisible(): boolean {
        return this._state === CeilState.Visible;
    }

    public IsUnknown():boolean{
        return this._state === CeilState.Hidden;
    }

    public SetSelected(visible: boolean): void {
        this.SetProperty(Archive.selectionCell,(e)=>e.alpha= visible ? 1 : 0);
        if(!visible){
            this._visibleHandlers.forEach(h=>h(this));
        }    
    }
    public IsSelected(): boolean {
        return this.GetCurrentSprites()[Archive.selectionCell].alpha === 1;
    }
    private _visibleHandlers: { (data: ISelectable):void }[] = [];

    public SubscribeUnselection(handler: (data: ISelectable) => void): void {
        this._visibleHandlers.push(handler);
    }
    public Unsubscribe(handler: (data: ISelectable) => void): void {
        this._visibleHandlers = this._visibleHandlers.filter(h => h !== handler);
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

    public HasOccupier():boolean{
        return !isNullOrUndefined(this._occupier);
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

        if(this._occupier != null)
        {
            return <AliveItem>(this._occupier as any);
        }

        return null;
    }

    public ContainsAlly(v:AliveItem):boolean{
        if(this._occupier && this._occupier instanceof AliveItem)
        {
            return !v.IsEnemy(this._occupier);
        }
        if(this._field && this._field instanceof Headquarter)
        {
            return !v.IsEnemy(this._field);
        }
        return false;
    }

    public ContainsEnemy(v:AliveItem):boolean{
        if(this._occupier && this._occupier instanceof AliveItem)
        {
            return v.IsEnemy(this._occupier) ;
        }
        if(this._field && this._field instanceof Headquarter)
        {
            return v.IsEnemy(this._field);
        }
        return false;
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

        this.OnCeilStateChanged(state);

        this._display[this._state].forEach(sprite=>
        {
            this.SetProperty(sprite, (e)=>e.alpha = 1);
        });
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