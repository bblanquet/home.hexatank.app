import {Item} from '../Items/Item';
import {CeilProperties} from './CeilProperties';
import { HexAxial } from "../Utils/Coordinates/HexAxial";
import { IField } from './Field/IField';
import { AliveItem } from '../Items/AliveItem';
import { BasicField } from './Field/BasicField';
import { CeilState } from './CeilState'; 
import { isNullOrUndefined } from 'util';
import { Archive } from '../Utils/ResourceArchiver';
import { ISelectable } from '../ISelectable';
import { Headquarter } from './Field/Headquarter';
import { ICeil } from './ICeil';
import { IMovable } from '../Items/IMovable';
import { PlaygroundHelper } from '../Utils/PlaygroundHelper';
import { BoundingBox } from '../Utils/BoundingBox';
import { Point } from '../Utils/Point';
import { Field } from './Field/Field';
import { IInteractionContext } from '../Context/IInteractionContext';
import { LiteEvent } from '../Utils/LiteEvent';
import { ContextMode } from '../Utils/ContextMode';

export class Ceil extends Item implements ICeil , ISelectable
{
    public Properties:CeilProperties;
    private _state:CeilState = CeilState.Hidden;
    private _display:{ [id: number]: Array<string>; };
    private _field:IField;
    private _occupier:IMovable;
    private _decorationSprite:string;
    private _areaSprite:string;
    private _circle: PIXI.Circle;
    public SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

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
        this._circle = new PIXI.Circle(0,0,PlaygroundHelper.Settings.Size/2);
    }

    public GetState(): CeilState {
        return this._state;
    }

    public CellStateChanged:LiteEvent<CeilState> = new LiteEvent<CeilState>();

    private OnCeilStateChanged(state:CeilState){
        this._state = state;
        this.CellStateChanged.trigger(this,this._state);
    }

    public IsVisible(): boolean {
        return this._state === CeilState.Visible;
    }

    public IsUnknown():boolean{
        return this._state === CeilState.Hidden;
    }

    public SetSelected(isSelected: boolean): void {
        isSelected ? PlaygroundHelper.Select():PlaygroundHelper.Unselect();
        this.SetProperty(Archive.selectionCell,(e)=>e.alpha= isSelected ? 1 : 0);
        this.SelectionChanged.trigger(this, this); 
    }
    public IsSelected(): boolean {
        return this.GetCurrentSprites()[Archive.selectionCell].alpha === 1;
    }

    public GetField():IField{
        return this._field;
    }

    public DestroyField(){
        new BasicField(this);
    }

    public SetField(field:IField){
        if(!isNullOrUndefined(this._field)){
            let field = this._field;
            this._field = null;
            (<Field>field).Destroy();
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
        if(this._occupier != null)
        {
            return <AliveItem>(this._occupier as any);
        }

        if(!isNullOrUndefined(this._field)){
            if(this._field.IsDesctrutible()){
                return <AliveItem> <any> this._field;
            }
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

        state = this.SetHqState(state);

        this.OnCeilStateChanged(state);

        this._display[this._state].forEach(sprite=>
        {
            this.SetProperty(sprite, (e)=>e.alpha = 1);
        });
    }

    private SetHqState(state: CeilState) {
        let ceils = new Array<Ceil>();
        ceils.push(PlaygroundHelper.PlayerHeadquarter.GetCeil());
        ceils = ceils.concat(PlaygroundHelper.PlayerHeadquarter.GetCeil().GetAllNeighbourhood().map(c => <Ceil>c));
        if (ceils.indexOf(this) !== -1) {
            state = CeilState.Visible;
        }
        return state;
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
        this.InitPosition(this.Properties.BoundingBox);
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

    public Update(viewX: number, viewY: number): void
    {
        super.Update(viewX,viewY);
    }

    public Select(context:IInteractionContext):boolean
    {
        if(PlaygroundHelper.Viewport.lastViewport){
            let scale = PlaygroundHelper.Viewport.lastViewport.scaleX;
            this._circle.radius = context.Mode === ContextMode.MultipleSelection ? PlaygroundHelper.Settings.Size/2 * scale: PlaygroundHelper.Settings.Size * scale;
            this._circle.radius = PlaygroundHelper.Settings.Size * scale;
            this._circle.x = (this.GetSprites()[0].x -PlaygroundHelper.Viewport.left) * scale;
            this._circle.y = (this.GetSprites()[0].y -PlaygroundHelper.Viewport.top) * scale;;
        }

        var isSelected = this._circle.contains(context.Point.x,context.Point.y);
        if(isSelected)
        {
            //console.log(`%c Q:${this.GetCoordinate().Q} R:${this.GetCoordinate().R}`,'color:blue;font-weight:bold;');
            context.OnSelect(this);
        }

        return false;
    }
}