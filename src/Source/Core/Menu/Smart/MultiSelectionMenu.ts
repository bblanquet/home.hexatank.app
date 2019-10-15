import { SelectionMode } from './SelectionMode';
import { Point } from '../../Utils/Point';
import { StaticBasicItem } from '../../Items/StaticBasicItem';
import { Archive } from '../../Utils/ResourceArchiver';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { BoundingBox } from '../../Utils/BoundingBox';
import { LiteEvent } from '../../Utils/LiteEvent';

export class MultiSelectionMenu {
    private _tankSelection:StaticBasicItem;
    private _cellSelection:StaticBasicItem;
    private _initialPoint:Point;
    private _isVisible:boolean=false;
    public SelectedModeEvent:LiteEvent<SelectionMode> = new LiteEvent<SelectionMode>(); 

    constructor(private movingEvent:LiteEvent<Point>)
    {
        this._tankSelection = new StaticBasicItem(BoundingBox.Create(0,0,
            PlaygroundHelper.Settings.Size*2,
            PlaygroundHelper.Settings.Size*4),
            Archive.menu.smartMenu.tankSelection,
            Archive.menu.smartMenu.hoverTankSelection,
            7,
            1.1);
        
        this._tankSelection.SetAlive(()=>true);
        this._tankSelection.SetVisible(this.IsVisible.bind(this));
        
        this._cellSelection = new StaticBasicItem(BoundingBox.Create(0,0,
            PlaygroundHelper.Settings.Size*2,
            PlaygroundHelper.Settings.Size*4),
            Archive.menu.smartMenu.cellSelection,
            Archive.menu.smartMenu.hoverCellSelection,
            7,
            1.1);
        
        PlaygroundHelper.Playground.Items.push(this._tankSelection);
        PlaygroundHelper.Playground.Items.push(this._cellSelection);

        this._cellSelection.SetAlive(()=>true);
        this._cellSelection.SetVisible(this.IsVisible.bind(this));

        this.movingEvent.on((e:Point)=>this.OnMouseMove(e));
    }

    public Show(point:Point):void{
        this._initialPoint = new Point(point.X,point.Y);
        this._isVisible = true;
        this._tankSelection.GetBoundingBox().X = (point.X - this._tankSelection.GetBoundingBox().Width); 
        this._tankSelection.GetBoundingBox().Y = point.Y - this._tankSelection.GetBoundingBox().Height/2;
        this._cellSelection.GetBoundingBox().X = point.X; 
        this._cellSelection.GetBoundingBox().Y = point.Y - this._tankSelection.GetBoundingBox().Height/2;
        this._tankSelection.IsHover = false;
        this._cellSelection.IsHover = false;
    }

    private IsVisible():boolean{
        return this._isVisible;
    }

    public OnMouseMove(point:Point){
        if(this._isVisible){
            if(point.X < this._initialPoint.X-10)
            {
                this._tankSelection.IsHover = true;
                this._cellSelection.IsHover = false;
            }
            else if(this._initialPoint.X+10 < point.X)
            {
                this._tankSelection.IsHover = false;
                this._cellSelection.IsHover = true;
            }
        }

    }

    public Hide():void{
        if(this._tankSelection.IsHover || this._cellSelection.IsHover){
            if(this._tankSelection.IsHover)
            {
                this.SelectedModeEvent.trigger(SelectionMode.unit);
            }
            else{
                this.SelectedModeEvent.trigger(SelectionMode.cell);
            }
        }
        this._isVisible = false;
    }

    public Destroy():void{
        this.movingEvent.off((e:Point)=>this.OnMouseMove(e));
    }
}