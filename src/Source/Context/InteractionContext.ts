import {Item} from '../Item';
import { IPatternChecker } from './IPatternChecker';
import { PatternChecker } from './PatternChecker';
import { Vehicle } from '../Vehicle';
import { CancelMenuItem } from '../Menu/CancelMenuItem';
import { Playground } from '../Playground';
import { PlaygroundHelper } from '../PlaygroundHelper';

export class InteractionContext{
    Point:PIXI.Point;
    private _selectedItem:Array<Item>;
    private _checker:IPatternChecker;

    constructor(){
        this._selectedItem = [];
        this._checker = new PatternChecker();
    }

    OnSelect(item:Item):void
    {
        if(item instanceof CancelMenuItem)
        {
            this.Clear();
            PlaygroundHelper.OnVehiculeUnSelected.trigger(vehicle);   
            return;
        }

        if(item instanceof Vehicle)
        {
            this.Clear();
            var vehicle = (<Vehicle>item);
            vehicle.SetSelected(true); 
            PlaygroundHelper.OnVehiculeSelected.trigger(vehicle);   
        }

        this._selectedItem.push(item);
        
        console.log(`%c [${this._selectedItem.length}] selected: ${item.constructor.name}`,'font-weight:bold;color:red;');
        
        this._checker.Check(this._selectedItem);
    }


    private Clear() {
        if (0 < this._selectedItem.length 
            && this._selectedItem[0] instanceof Vehicle) 
        {
            var vehicle = (<Vehicle>this._selectedItem[0]);
            vehicle.SetSelected(false);
            PlaygroundHelper.OnVehiculeUnSelected.trigger(vehicle); 
        }
        this._selectedItem = [];
    }
}