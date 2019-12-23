import { BoundingBox } from '../Utils/BoundingBox';
import { Archive } from '../Utils/ResourceArchiver';
import { Cell } from './Cell';
import { Item } from '../Items/Item';
import { InteractionContext } from '../Context/InteractionContext';

export class FlagCell extends Item{

    private _cell:Cell;
    private _isIncreasingOpacity:boolean=false;

    constructor(cell:Cell){
        super();
        this.Z = 2;
        this.GenerateSprite(Archive.flagCell,e=>{
            e.anchor.set(0.50);
            e.alpha = 0;
        });
        this._cell = cell;
        this.InitPosition(cell.GetBoundingBox());
        this.IsCentralRef = true;
    }

    public GetCell():Cell{
        return this._cell;
    }

    public SetCell(cell:Cell):void{
        this._cell = cell;
        this.InitPosition(this._cell.GetBoundingBox());
    }
    public GetBoundingBox(): BoundingBox {
        return this._cell.GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    public Update(viewX: number, viewY: number):void
    {
        super.Update(viewX,viewY);

        this.SetProperty(Archive.flagCell,s=>{
            if(s.alpha < 0){
                this._isIncreasingOpacity = true;
            }

            if(1 <= s.alpha){
                this._isIncreasingOpacity = false;
            }

            s.alpha += this._isIncreasingOpacity ? 0.07 : -0.07; 
        });
        
    };

}