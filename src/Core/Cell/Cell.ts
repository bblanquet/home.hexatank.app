import {Item} from '../Items/Item';
import {CellProperties} from './CellProperties';
import { HexAxial } from "../Utils/Coordinates/HexAxial";
import { IField } from './Field/IField';
import { AliveItem } from '../Items/AliveItem';
import { BasicField } from './Field/BasicField';
import { CellState } from './CellState'; 
import { isNullOrUndefined } from 'util';
import { Archive } from '../Utils/ResourceArchiver';
import { ISelectable } from '../ISelectable';
import { Headquarter } from './Field/Headquarter';
import { ICell } from './ICell';
import { IMovable } from '../Items/IMovable';
import { PlaygroundHelper } from '../Utils/PlaygroundHelper';
import { BoundingBox } from '../Utils/BoundingBox';
import { Point } from '../Utils/Point';
import { Field } from './Field/Field';
import { IInteractionContext } from '../Context/IInteractionContext';
import { LiteEvent } from '../Utils/LiteEvent';
import { ContextMode } from '../Utils/ContextMode';
import { Vehicle } from '../Items/Unit/Vehicle';
import { GameSettings } from '../Utils/GameSettings';

export class Cell extends Item implements ICell , ISelectable
{
    public Properties:CellProperties;
    private _state:CellState = CellState.Hidden;
    private _display:{ [id: number]: Array<string>; };
    private _field:IField;
    private _occupier:IMovable;
    private _decorationSprite:string;
    private _areaSprite:string;
    private _circle: PIXI.Circle;
    public SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

    constructor(properties:CellProperties)
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
        this._circle = new PIXI.Circle(0,0,GameSettings.Size/2);
    }

    public GetState(): CellState {
        return this._state;
    }

    public CellStateChanged:LiteEvent<CellState> = new LiteEvent<CellState>();

    private OncellStateChanged(state:CellState){
        this._state = state;
        this.CellStateChanged.trigger(this,this._state);
    }

    public IsVisible(): boolean {
        return this._state === CellState.Visible;
    }

    public IsUnknown():boolean{
        return this._state === CellState.Hidden;
    }

    public SetSelected(isSelected: boolean): void {
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

    public HasAroundOccupier():boolean{
        return (this.HasOccupier() 
        || this.GetAllNeighbourhood().filter(c => (<Cell>c).HasOccupier()).length > 0);
    }

    public HasAroundAlly(a:AliveItem):boolean{
        return (this.ContainsAlly(a)  
        || this.GetAllNeighbourhood().filter(c => (<Cell>c).ContainsAlly(a)).length > 0);
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
            if(v instanceof(Vehicle) && (<Vehicle>v).HasCamouflage){
                return false;             
            }
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

    public SetState(state:CellState):void{
        this.GetSprites().forEach(sprite=> sprite.alpha = 0);

        if(!isNullOrUndefined(this._areaSprite))
        {
            this.SetProperty(this._areaSprite,(e)=>e.alpha = 0.2);
        }

        state = this.SetHqState(state);

        this.OncellStateChanged(state);

        this._display[this._state].forEach(sprite=>
        {
            this.SetProperty(sprite, (e)=>e.alpha = 1);
        });
    }

    private SetHqState(state: CellState) {
        let cells = new Array<Cell>();
        cells.push(PlaygroundHelper.PlayerHeadquarter.GetCell());
        cells = cells.concat(PlaygroundHelper.PlayerHeadquarter.GetCell().GetAllNeighbourhood().map(c => <Cell>c));
        if (cells.indexOf(this) !== -1) {
            state = CellState.Visible;
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

        this._display[CellState.Hidden] = [Archive.hiddenCell];
        
        if(isNullOrUndefined(this._decorationSprite))
        {
            this._display[CellState.Mist] = [Archive.halfVisibleCell,Archive.cell]; 
            this._display[CellState.Visible] = [Archive.cell];      
        }
        else
        {
            this._display[CellState.Mist] = [Archive.halfVisibleCell,this._decorationSprite,Archive.cell];         
            this._display[CellState.Visible] = [this._decorationSprite,Archive.cell];         
        }
        this.InitPosition(this.Properties.BoundingBox);
    }

    public GetCoordinate():HexAxial{
        return this.Properties.Coordinate;
    }

    public GetCentralPoint():Point{
        return this.Properties.GetCentralPoint();
    }

    public GetAll(range:number=1):Array<Cell>{
        var cells = new Array<Cell>();
        cells.push(this);
        this.GetCoordinate().GetNeighbours(range).forEach(coordinate => {
            var cell = PlaygroundHelper.CellsContainer.Get(coordinate);
            if(cell)
            {
                cells.push(cell);
            }
        });
        return cells;
    }

    public GetAllNeighbourhood(range:number=1):Array<ICell>{
        var cells = new Array<ICell>();
        this.GetCoordinate().GetNeighbours(range).forEach(coordinate => {
            var cell = PlaygroundHelper.CellsContainer.Get(coordinate);
            if(cell)
            {
                cells.push(cell);
            }
        });
        return cells;
    }

    public GetSpecificRange(range:number=1):Array<ICell>{
        var cells = new Array<ICell>();
        this.GetCoordinate().GetSpecificRange(range).forEach(coordinate => {
            var cell = PlaygroundHelper.CellsContainer.Get(coordinate);
            if(cell)
            {
                cells.push(cell);
            }
        });
        return cells;
    }

    public GetNeighbourhood(range:number=1):Array<ICell>{
        var cells = new Array<ICell>();
        this.GetCoordinate().GetNeighbours(range).forEach(coordinate => {
            var cell = PlaygroundHelper.CellsContainer.Get(coordinate);
            if(cell != null && !cell.IsBlocked())
            {
                cells.push(cell); 
            }
        });
        return cells;
    }

    public Update(viewX: number, viewY: number): void
    {
        super.Update(viewX,viewY);
    }

    public Select(context:IInteractionContext):boolean
    {
        if(PlaygroundHelper.Viewport.lastViewport){
            let scale = PlaygroundHelper.Viewport.lastViewport.scaleX;
            this._circle.radius = context.Mode === ContextMode.MultipleSelection ? GameSettings.Size/2 * scale: GameSettings.Size * scale;
            this._circle.radius = GameSettings.Size * scale;
            this._circle.x = (this.GetSprites()[0].x -PlaygroundHelper.Viewport.left) * scale;
            this._circle.y = (this.GetSprites()[0].y -PlaygroundHelper.Viewport.top) * scale;;
        }

        var isSelected = this._circle.contains(context.Point.x,context.Point.y);
        if(isSelected)
        {
            console.log(`%c Q:${this.GetCoordinate().Q} R:${this.GetCoordinate().R}`,'color:blue;font-weight:bold;');
            context.OnSelect(this);
        }

        return false;
    }
}