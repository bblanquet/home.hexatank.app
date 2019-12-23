import { isNullOrUndefined } from 'util';
import { Archive } from '../../Utils/ResourceArchiver';
import { BasicItem } from '../../Items/BasicItem';
import { CellContainer } from '../../Cell/CellContainer';
import { IInteractionContext, InteractionKind } from '../../Context/IInteractionContext';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { Point } from '../../Utils/Point';
import { Cell } from '../../Cell/Cell';  
import { Item } from '../../Items/Item';
import { ContextMode } from '../../Utils/ContextMode';

export class MovingInteractionContext implements IInteractionContext{
    public Kind: InteractionKind;
    public Mode: ContextMode;
    public Point: PIXI.Point;
    private _cells:CellContainer<Cell>;
    private _enlightCells:BasicItem[];
    private _isOn:boolean;
    
    constructor()
    {
        this._cells = new CellContainer<Cell>();
        this._enlightCells = new Array<BasicItem>();
    }

    public Start():void{
        this._isOn = true;
    }

    public Moving(point:Point):void{
        this.Point = new PIXI.Point(point.X,point.Y);
        if(this._isOn){
            PlaygroundHelper.Playground.Items.forEach(item=>{
                item.Select(this);
            });
        }
    }

    public GetCells():Cell[]{
        return this._cells.GetAll();
    }

    public Stop():void{
        this._isOn = false;
        this._cells = new CellContainer();
        this._enlightCells.forEach(c=>c.Destroy());
        this._enlightCells = [];
    }

    public OnSelect(item: Item): void {
        if(isNullOrUndefined(item)){
            return;
        }

        if(item instanceof Cell)
        {
            const cell = <Cell> item;
            if(this._cells.Get(cell.GetCoordinate()) === null){
                this._cells.Add(cell);
                const displayPath = new BasicItem(cell.GetBoundingBox(),Archive.menu.smartMenu.multiCellSelection,5);
                displayPath.SetAlive(()=>true);
                displayPath.SetVisible(()=>true);
                this._enlightCells.push(displayPath);
                PlaygroundHelper.Playground.Items.push(displayPath);
            }
        }
    }

}