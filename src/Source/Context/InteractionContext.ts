import {Item} from '../Item';
import { IPatternChecker } from './IPatternChecker';
import { PatternChecker } from './PatternChecker';
import { IInteractionContext } from './IInteractionContext';
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
import { Ceil } from '../Ceil';
import { Vehicle } from '../Unit/Vehicle';
import { Headquarter } from '../Field/Headquarter';
import { Menu } from '../Menu/Menu';
import { ZoomInCombination } from './Combination/ZoomInCombination';
import { ZoomOutCombination } from './Combination/ZoomOutCombination';
import { MoneyCeilCombination } from './Combination/MoneyCeilCombination';
import { TargetCombination } from './Combination/TargetCombination';

export class InteractionContext implements IInteractionContext{

    Point:PIXI.Point;
    public IsDown:boolean;
    private _selectedItem:Array<Item>;
    private _checker:IPatternChecker;
    private _isSelectable:{(item:Item):boolean};
    private _currentHq:Headquarter;

    public SetCombination(menus:Menu[],currentHq:Headquarter):void{
        this._selectedItem = [];
        this._isSelectable = this.IsSelectable.bind(this);
        this._currentHq = currentHq;
        let combinations = new Array<ICombination>();
        combinations.push(new ZoomOutCombination());
        combinations.push(new ZoomInCombination());        
        combinations.push(new CancelCombination(this));
        combinations.push(new TruckCombination());
        combinations.push(new TankCombination());
        combinations.push(new PatrolCombination());
        combinations.push(new ClearTrashCombination(this._isSelectable, this));
        combinations.push(new UnselectCombination(this._isSelectable, this));
        combinations.push(new SelectionCombination(menus,this._isSelectable));
        combinations.push(new FastCeilCombination());
        combinations.push(new TargetCombination());    
        combinations.push(new AttackCeilCombination());
        combinations.push(new MoneyCeilCombination());
        combinations.push(new HealCeilCombination());
        this._checker = new PatternChecker(combinations);
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
        else if(item instanceof Headquarter)
        {
            return item === this._currentHq;
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
        if(item instanceof Ceil){
            if(this.ContainsSelectable(item))
            {
                item = this.GetSelectable(item);
            }
        }

        this._selectedItem.push(item);   
        console.log(`%c [${this._selectedItem.length}] selected: ${item.constructor.name}`,'font-weight:bold;color:red;');
        this._checker.Check(this._selectedItem);
    }

    public Push(item: Item): void {
        this.OnSelect(item);
    }

    ClearContext(): void {
        this._selectedItem = [];
    }
}