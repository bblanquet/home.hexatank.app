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

export class InteractionContext implements IInteractionContext{

    Point:PIXI.Point;
    private _selectedItem:Array<Item>;
    private _checker:IPatternChecker;
    private _isSelectable:{(item:Item):boolean};
    constructor(isSelectable:{(item:Item):boolean}){ 
        this._selectedItem = [];
        this._isSelectable = isSelectable;
        let combinations = new Array<ICombination>();
        combinations.push(new CancelCombination(isSelectable,this));
        combinations.push(new ClearTrashCombination(isSelectable,this));
        combinations.push(new UnselectCombination(isSelectable,this));
        combinations.push(new SelectionCombination(isSelectable));
        combinations.push(new TruckCombination());
        combinations.push(new TankCombination());
        combinations.push(new PatrolCombination());
        combinations.push(new FastCeilCombination());
        combinations.push(new AttackCeilCombination());
        combinations.push(new HealCeilCombination());
        
        this._checker = new PatternChecker(combinations);
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

    OnSelect(item:Item):void
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

    Push(item: Item): void {
        this.OnSelect(item);
    }

    ClearContext(): void {
        this._selectedItem = [];
    }
}