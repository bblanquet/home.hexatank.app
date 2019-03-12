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

export class InteractionContext implements IInteractionContext{

    Point:PIXI.Point;
    private _selectedItem:Array<Item>;
    private _checker:IPatternChecker;

    constructor(isSelectable:{(item:Item):boolean}){ 
        this._selectedItem = [];
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

    OnSelect(item:Item):void
    {
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