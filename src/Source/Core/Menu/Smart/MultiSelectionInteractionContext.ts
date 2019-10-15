import { Archive } from '../../Utils/ResourceArchiver';
import { BasicItem } from '../../Items/BasicItem';
import { CeilsContainer } from '../../Ceils/CeilsContainer';
import { IInteractionContext } from '../../Context/IInteractionContext';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { Point } from '../../Utils/Point';
import { LiteEvent } from '../../Utils/LiteEvent';
import { Ceil } from '../../Ceils/Ceil';
import { Item } from '../../Items/Item';
import { CheckableMenuItem } from '../CheckableMenuItem';

export class MultiSelectionInteractionContext implements IInteractionContext{
    public Point: PIXI.Point;
    private _cells:CeilsContainer<Ceil>;
    private _menuItem:CheckableMenuItem;
    private _overrideCells:BasicItem[];
    private _isOn:boolean;
    private _isDown:boolean;
    constructor(
        downEvent:LiteEvent<Point>,
        movingEvent:LiteEvent<Point>,
        down:LiteEvent<boolean>)
    {
        this._cells = new CeilsContainer<Ceil>();
        this._overrideCells = new Array<BasicItem>();
        movingEvent.on((e)=>this.OnMouseMoved(e));
        down.on(e=>this._isDown = e);
        downEvent.on((e)=>this.OnMouseMoved(e));
    }

    public Start():void{
        this._isOn = true;
    }

    private OnMouseMoved(point:Point):void{
        this.Point = new PIXI.Point(point.X,point.Y);
        if(this._isOn && this._isDown){
            PlaygroundHelper.Playground.Items.forEach(item=>{
                item.Select(this);
            });
        }
    }

    public GetCells():Ceil[]{
        return this._cells.GetAll();
    }

    public GetCellButton():CheckableMenuItem{
        return this._menuItem;
    }

    public Stop():void{
        console.log('stopping');
        this._isOn = false;
        this._cells = new CeilsContainer();
        this._overrideCells.forEach(c=>c.Destroy());
        this._overrideCells = [];
        this._menuItem = null;
    }

    public OnSelect(item: Item): void {
        if(item instanceof Ceil){
            var cell = <Ceil> item;
            if(this._cells.Get(cell.GetCoordinate()) === null){
                this._cells.Add(cell);
                let c = new BasicItem(cell.GetBoundingBox(),Archive.menu.smartMenu.multiCellSelection,5);
                c.SetAlive(()=>true);
                c.SetVisible(()=>true);
                this._overrideCells.push(c);
                PlaygroundHelper.Playground.Items.push(c);
            }
        }
        else if(item instanceof CheckableMenuItem){
            this._menuItem = item;
        }
    }

}