import {Item} from '../Item';
import { IPatternChecker } from './IPatternChecker';
import { PatternChecker } from './PatternChecker';
import { CancelMenuItem } from '../Menu/CancelMenuItem';
import { PlaygroundHelper } from '../PlaygroundHelper';
import { ISelectable } from '../ISelectable';

export class InteractionContext{
    Point:PIXI.Point;
    private _selectedItem:Array<Item>;
    private _checker:IPatternChecker;
    private _isSelectable:{(item:Item):boolean};

    constructor(isSelectable:{(item:Item):boolean}){ 
        this._selectedItem = [];
        this._isSelectable = isSelectable;
        this._checker = new PatternChecker();
    }

    private IsSelectableItem(item: any):item is ISelectable{
        return 'SetSelected' in item;
    }
    private ToSelectableItem(item: any):ISelectable{
        if(this.IsSelectableItem(item)){
            return <ISelectable> item;
        }
        return null;
    }

    OnSelect(item:Item):void
    {
        if(item instanceof CancelMenuItem)
        {
            this.Clear();
            return;
        }

        if(this._isSelectable(item))
        {
            if(item === this._selectedItem[0])
            {
                this.Clear();
                return;
            }
            else
            {
                const selectable = this.ToSelectableItem(item);
                this.Clear();
                selectable.SetSelected(true); 
                PlaygroundHelper.OnSelectedItem.trigger(this,selectable);   
            }
        }

        this._selectedItem.push(item);
        
        console.log(`%c [${this._selectedItem.length}] selected: ${item.constructor.name}`,'font-weight:bold;color:red;');
        
        this._checker.Check(this._selectedItem);
    }


    private Clear() {
        if (0 < this._selectedItem.length 
            && this.IsSelectableItem(this._selectedItem[0])) 
        {
            var selectable = <ISelectable> <any> (this._selectedItem[0]);
            selectable.SetSelected(false);
            PlaygroundHelper.OnUnselectedItem.trigger(this,selectable); 
        }
        this._selectedItem = [];
    }
}