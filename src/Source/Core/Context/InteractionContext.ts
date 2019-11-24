import { ContextMode } from './../Utils/ContextMode';
import { MultiCellSelectionCombination } from './Combination/Multi/MultiCellSelectionCombination';
import { MultiUnitSelectionCombination } from './Combination/Multi/MultiUnitSelectionCombination';
import { MultiSelectionCombination } from './Combination/Multi/MultiSelectionCombination';
import { UpMultiMenuCombination } from './Combination/Multi/UpMultiMenuCombination';
import { MovingMultiMenuCombination } from './Combination/Multi/MovingMultiMenuCombination';
import { MultiSelectionMenu } from './../Menu/Smart/MultiSelectionMenu';
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
import { FastCeilCombination } from './Combination/FastCeilCombination'; 
import { AttackCeilCombination } from './Combination/AttackCeilCombination'; 
import { HealCeilCombination } from './Combination/HealCeilCombination';
import { ICombination } from './Combination/ICombination';
import { SelectionCombination } from './Combination/SelectionCombination';
import { CancelCombination } from './Combination/CancelCombination';
import { MoneyCeilCombination } from './Combination/MoneyCeilCombination';
import { TargetCombination } from './Combination/TargetCombination';
import { SwitchToVehicleCombination } from './Combination/SwitchToVehicleCombination';
import * as PIXI from 'pixi.js';
import { Item } from '../Items/Item';
import { Headquarter } from '../Ceils/Field/Headquarter';
import { Ceil } from '../Ceils/Ceil';
import { Vehicle } from '../Items/Unit/Vehicle';
import { ICombinationDispatcher } from './ICombinationDispatcher';
import { MovingInteractionContext } from '../Menu/Smart/MovingInteractionContext';
import { isNullOrUndefined } from 'util';

export class InteractionContext implements IContextContainer, IInteractionContext{
    public Mode: ContextMode=ContextMode.SingleSelection;
    public Kind: InteractionKind;
    public Point:PIXI.Point;
    private _selectedItem:Array<Item>; 
    private _dispatcher:ICombinationDispatcher;

    private _isSelectable:{(item:Item):boolean};
    private _currentHq:Headquarter;

    public SetCombination(currentHq:Headquarter):void{
        this._selectedItem = [];
        this._isSelectable = this.IsSelectable.bind(this);
        this._currentHq = currentHq; 
        this.SetListener();
    }

    private SetListener() {
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
        combinations.push(new AddTankCombination());
        combinations.push(new AddTruckCombination());
        combinations.push(new SwitchToVehicleCombination());
        combinations.push(new CancelCombination(this));
        combinations.push(new TruckDiamondCombination(this));
        combinations.push(new TruckCombination());
        combinations.push(new TankCombination());
        combinations.push(new PatrolCombination());
        combinations.push(new ClearTrashCombination(this._isSelectable, this));
        combinations.push(new UnselectCombination(this._isSelectable, this));
        combinations.push(new SelectionCombination(this._isSelectable));
        combinations.push(new FastCeilCombination());
        combinations.push(new TargetCombination(this));
        combinations.push(new AttackCeilCombination());
        combinations.push(new MoneyCeilCombination());
        combinations.push(new HealCeilCombination());
        this._dispatcher = new CombinationDispatcher(combinations);
    }

    public IsSelectable(item:Item):boolean
    {
        if(item instanceof Ceil){
            return true;
        }
        else if(item instanceof Vehicle){
            const vehicle = <Vehicle> item;
            return !vehicle.IsEnemy(this._currentHq);
        }
        return false;
    }


    private ContainsSelectable(item:Item):Boolean{
        return this._isSelectable(<Item><any>(<Ceil>item).GetOccupier())
            || this._isSelectable(<Item><any>(<Ceil>item).GetField());
    }

    private GetSelectable(i: Ceil):Item {
        if(this._isSelectable(<Item><any>(<Ceil>i).GetOccupier()))
        {
            return <Item><any>(<Ceil>i).GetOccupier();
        }
        else{
            return <Item><any>(<Ceil>i).GetField();
        }
    }

    public OnSelect(item:Item):void
    {
        if(!isNullOrUndefined(item)){
            if(item instanceof Ceil){
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