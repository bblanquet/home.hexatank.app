import { SwitchToHeadquarterCombination } from './Combination/SwitchToHeadquarterCombination';
import { PowerUpCombination } from './Combination/PowerUpCombination';
import { PowerDownCombination } from './Combination/PowerDownCombination';
import { RangeDownCombination } from './Combination/RangeDownCombination';
import { RangeUpCombination } from './Combination/RangeUpCombination';
import { InfluenceCombination } from './Combination/InfluenceCombination';
import { CamouflageCombination } from './Combination/CamouflageCombination';
import { InputManager } from '../Utils/InputManager';
import { PlaygroundHelper } from '../Utils/PlaygroundHelper';
import { PoisonCellCombination } from './Combination/PoisonCellCombination';
import { SlowCellCombination } from './Combination/SlowCellCombination';
import { ContextMode } from '../Utils/ContextMode';
import { MultiCellSelectionCombination } from './Combination/Multi/MultiCellSelectionCombination';
import { MultiUnitSelectionCombination } from './Combination/Multi/MultiUnitSelectionCombination';
import { MultiSelectionCombination } from './Combination/Multi/MultiSelectionCombination';
import { UpMultiMenuCombination } from './Combination/Multi/UpMultiMenuCombination';
import { MovingMultiMenuCombination } from './Combination/Multi/MovingMultiMenuCombination';
import { MultiSelectionMenu } from '../Menu/Smart/MultiSelectionMenu';
import { DisplayMultiMenuCombination } from './Combination/Multi/DisplayMultiMenuCombination';
import { CombinationContext } from './Combination/CombinationContext';
import { AddTruckCombination } from './Combination/AddTruckCombination';
import { AddTankCombination } from './Combination/AddTankCombination';
import { FlagCellCombination } from './Combination/FlagCellCombination';
import { TruckDiamondCombination } from './Combination/TruckDiamondCombination';
import { CombinationDispatcher } from './CombinationDispatcher'; 
import { IContextContainer } from './IContextContainer';
import {IInteractionContext, InteractionKind} from './IInteractionContext';
import { UnselectCombination } from './Combination/UnselectCombination';
import { ClearTrashCombination } from './Combination/ClearTrashCombination';
import { TruckCombination } from './Combination/TruckCombination';
import { TankCombination } from './Combination/TankCombination';
import { PatrolCombination } from './Combination/PatrolCombination';
import { FastCellCombination } from './Combination/FastcellCombination'; 
import { AttackCellCombination } from './Combination/AttackcellCombination'; 
import { HealCellCombination as HealCellCombination } from './Combination/HealcellCombination';
import { ICombination } from './Combination/ICombination';
import { SelectionCombination } from './Combination/SelectionCombination';
import { CancelCombination } from './Combination/CancelCombination';
import { MoneyCellCombination } from './Combination/MoneycellCombination';
import { TargetCombination } from './Combination/TargetCombination';
import { SwitchToVehicleCombination } from './Combination/SwitchToVehicleCombination';
import * as PIXI from 'pixi.js';
import { Item } from '../Items/Item';
import { Headquarter } from '../Cell/Field/Headquarter';
import { Cell } from '../Cell/Cell';
import { Vehicle } from '../Items/Unit/Vehicle';
import { ICombinationDispatcher } from './ICombinationDispatcher'; 
import { MovingInteractionContext } from '../Menu/Smart/MovingInteractionContext';
import { isNullOrUndefined } from 'util';
import { Point } from '../Utils/Point';
import { InfluenceField } from '../Cell/Field/InfluenceField';

export class InteractionContext implements IContextContainer, IInteractionContext{
    public Mode: ContextMode=ContextMode.SingleSelection;
    public Kind: InteractionKind;
    public Point:PIXI.Point;
    private _selectedItem:Array<Item>; 
    private _dispatcher:ICombinationDispatcher;

    private _isSelectable:{(item:Item):boolean};
    private _currentHq:Headquarter;

    constructor(private _inputManager:InputManager){

    }

    public SetCombination(currentHq:Headquarter):void{
        this._selectedItem = [];
        this._isSelectable = this.IsSelectable.bind(this);
        this._currentHq = currentHq; 
        const multiselectionMenu = new MultiSelectionMenu();
        const multiSelectionContext = new MovingInteractionContext();
        let combinations = new Array<ICombination>();
        
        combinations.push(new DisplayMultiMenuCombination(this,multiselectionMenu));
        combinations.push(new MovingMultiMenuCombination(multiselectionMenu));
        combinations.push(new UpMultiMenuCombination(multiselectionMenu,this));
        combinations.push(new MultiSelectionCombination(multiSelectionContext));
        combinations.push(new MultiUnitSelectionCombination(multiselectionMenu,multiSelectionContext,this));
        combinations.push(new MultiCellSelectionCombination(multiselectionMenu,multiSelectionContext,this));
        combinations.push(new FlagCellCombination());
        combinations.push(new InfluenceCombination());
        combinations.push(new AddTankCombination());
        combinations.push(new AddTruckCombination());
        combinations.push(new SwitchToVehicleCombination());
        combinations.push(new SwitchToHeadquarterCombination());
        combinations.push(new CancelCombination(this));
        combinations.push(new TruckDiamondCombination(this));
        combinations.push(new TruckCombination());
        combinations.push(new TankCombination());
        combinations.push(new PatrolCombination());
        combinations.push(new ClearTrashCombination(this._isSelectable, this));
        combinations.push(new UnselectCombination(this._isSelectable, this));
        combinations.push(new SelectionCombination(this._isSelectable));
        combinations.push(new FastCellCombination());
        combinations.push(new CamouflageCombination());
        combinations.push(new TargetCombination(this));
        combinations.push(new AttackCellCombination());
        combinations.push(new SlowCellCombination());
        combinations.push(new PoisonCellCombination());
        combinations.push(new MoneyCellCombination());
        combinations.push(new HealCellCombination());
        combinations.push(new RangeUpCombination());
        combinations.push(new RangeDownCombination());
        combinations.push(new PowerDownCombination());
        combinations.push(new PowerUpCombination());
        this._dispatcher = new CombinationDispatcher(combinations);
    }

    public Mute():void{
        this._inputManager.MovingUpEvent.off(this.MovingUp().bind(this));
        this._inputManager.UpEvent.off(this.Up().bind(this));
        this._inputManager.HoldingEvent.off(this.Holding().bind(this));
        this._inputManager.MovingUpEvent.off(this.MovingUp().bind(this));
        this._inputManager.MovingEvent.off(this.Moving().bind(this));
    }

    public Listen():void{
        this._inputManager.UpEvent.on(this.Up().bind(this));
        this._inputManager.MovingUpEvent.on(this.MovingUp().bind(this));
        this._inputManager.DownEvent.on(this.Down().bind(this));
        this._inputManager.HoldingEvent.on(this.Holding());
        this._inputManager.MovingEvent.on(this.Moving());
    }

    private Moving(): (obj: any, data?: Point) => void {
        return (point: Point) => {
            this.Notify(InteractionKind.Moving, point);
        };
    }

    private Holding(): (obj: any, data?: Point) => void {
        return (point: Point) => {
            this.Notify(InteractionKind.Holding, point);
        };
    }

    private Down(): (obj: any, data?: Point) => void {
        return (point: Point) => {
            this.Notify(InteractionKind.Down, point);
        };
    }

    private Up(): (obj: any, data?: Point) => void {
        return (point: Point) => {
            this.NotifyContext(InteractionKind.Up, point);
        };
    }

    private MovingUp(): (obj: any, data?: Point) => void {
        return (point: Point) => {
            this.Notify(InteractionKind.MovingUp, point);
        };
    }

    private Notify(kind:InteractionKind,point: Point) {
        this.Point = new PIXI.Point(point.X, point.Y);
        this.Kind = kind;
        this.OnSelect(null);
    }

    private NotifyContext(kind:InteractionKind,point: Point) {
        this.Point = new PIXI.Point(point.X, point.Y);
        this.Kind = kind;
        if(this.Mode === ContextMode.SingleSelection){
            PlaygroundHelper.Playground.Select(this);
        }else{
            this.OnSelect(null);
        }
    }

    public IsSelectable(item:Item):boolean
    {
        if(item instanceof Cell){
            return true;
        }
        else if(item instanceof Vehicle){
            const vehicle = <Vehicle> item;
            return !vehicle.IsEnemy(this._currentHq);
        }
        else if(item instanceof InfluenceField){
            const influenceField = <InfluenceField> item;
            return influenceField.Hq === this._currentHq;
        }
        else if(item instanceof Headquarter){
            const hq = <Headquarter> item;
            return hq === this._currentHq;
        }
        return false;
    }


    private ContainsSelectable(item:Item):Boolean{
        return this._isSelectable(<Item><any>(<Cell>item).GetOccupier())
            || this._isSelectable(<Item><any>(<Cell>item).GetField());
    }

    private GetSelectable(i: Cell):Item {
        if(this._isSelectable(<Item><any>(<Cell>i).GetOccupier()))
        {
            return <Item><any>(<Cell>i).GetOccupier();
        }
        else{
            return <Item><any>(<Cell>i).GetField();
        }
    }

    public OnSelect(item:Item):void
    {
        if(!isNullOrUndefined(item)){
            if(item instanceof Cell){
                if(this.ContainsSelectable(item))
                {
                    item = this.GetSelectable(item);
                }
            }
            this._selectedItem.push(item);  
        }
        if(this.Kind !== InteractionKind.Moving){
            console.log(`%c [${this._selectedItem.length}] selected: ${item ? item.constructor.name:'none'} ${InteractionKind[this.Kind]} ${ContextMode[this.Mode]}`,'font-weight:bold;color:red;');
        }
        
        let context = new CombinationContext();
        context.Items = this._selectedItem;
        context.InteractionKind = this.Kind;
        context.ContextMode = this.Mode;
        context.Point = this.Point;
        this._dispatcher.Check(context);
    }

    public Push(item: Item, forced:boolean): void {
        if(forced){
            this.OnSelect(item);
        }else{
            this._selectedItem.push(item);
        }
    }

    ClearContext(): void {
        this._selectedItem = [];
    }
}