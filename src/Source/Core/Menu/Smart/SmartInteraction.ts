import { Archive } from './../../Utils/ResourceArchiver';
import { BasicItem } from './../../Items/BasicItem';
import { CeilsContainer } from './../../Ceils/CeilsContainer';
import { IInteractionContext } from './../../Context/IInteractionContext';
import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { Point } from './../../Utils/Point';
import { SelectionMode } from './SelectionMode';
import { LiteEvent } from './../../Utils/LiteEvent';
import { Ceil } from '../../Ceils/Ceil';
import { Item } from '../../Items/Item';

export class SmartInteraction implements IInteractionContext{
    public Point: PIXI.Point;
    private _cells:CeilsContainer<Ceil>;
    private _overrideCells:BasicItem[];
    private _currentMode:SelectionMode;

    constructor(selectionMode:LiteEvent<SelectionMode>
        , movingEvent:LiteEvent<Point>
        , stop:LiteEvent<Point>)
        {
        this._cells = new CeilsContainer();
        this._overrideCells = new Array<BasicItem>();
        this._currentMode = SelectionMode.none;
        stop.on((e)=>this.OnStop());
        movingEvent.on((e)=>this.OnMouseMoved(e));
        selectionMode.on((e)=>this.OnModeChanged(e));
    }

    private OnModeChanged(mode:SelectionMode):void{
        console.log('changing mode');
        this._currentMode = mode;
        if(this._currentMode !== SelectionMode.none){
            PlaygroundHelper.PauseNavigation();
        }
    }

    private OnMouseMoved(point:Point):void{
        if(this._currentMode !== SelectionMode.none){
            console.log('interacting');
            PlaygroundHelper.Playground.Items.forEach(item=>{
                item.Select(this);
            });
        }
    }

    private OnStop():void{
        console.log('stopping');
        PlaygroundHelper.RestartNavigation();
        this._currentMode = SelectionMode.none;
        this._cells = new CeilsContainer();
        this._overrideCells.forEach(c=>c.Destroy());
        this._overrideCells = [];
    }

    public OnSelect(item: Item): void {
        if(item instanceof Ceil){
            var cell = <Ceil> item;
            if(this._cells.Get(cell.GetCoordinate()) === null){
                this._cells.Add(cell);
                let c = new BasicItem(cell.GetBoundingBox(),Archive.menu.smartMenu.multiCellSelection,5);
                this._overrideCells.push(c);
                PlaygroundHelper.Playground.Items.push(c);
            }
        }
    }

}