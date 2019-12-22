import { SimpleOrder } from './SimpleOrder';
import { OrderState } from "./OrderState";
import { Order } from './Order';
import { Ceil } from '../../Ceils/Ceil';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class PersistentOrder extends Order{

    private _currentOrder:SimpleOrder;

    constructor(protected OriginalDest:Ceil,private _v:Vehicle){
        super();
        this._currentOrder = new SimpleOrder(this.OriginalDest,this._v);
        this._v.CellChanged.on(()=>this.OnCellChanged);
    }

    private OnCellChanged():void{
        this._currentOrder = new SimpleOrder(this.OriginalDest,this._v);
    }

    public Cancel():void{
        this._v.CellChanged.off(()=>this.OnCellChanged);
        if(this._currentOrder){
            this._currentOrder.Cancel();
        }
    }

    Do(): void 
    {
        if(this._currentOrder.IsDone())
        {
            if(this._currentOrder.GetState() !== OrderState.Passed){
                this._currentOrder.Reset();
            }
            else
            {
                this._v.CellChanged.off(()=>this.OnCellChanged);
            }
        }
        else
        {
            this._currentOrder.Do();
        }
    }
}