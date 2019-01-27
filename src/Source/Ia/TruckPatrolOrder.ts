import { Order } from "./Order";
import { OrderState } from "./OrderState";
import { HqFieldOrder } from "./HqFieldOrder";
import { DiamondFieldOrder } from "./DiamondFieldOrder";
import { SimpleOrder } from "./SimpleOrder";

export class TruckPatrolOrder extends Order
{ 
    private _currentOrder:SimpleOrder;

    constructor(private _hqOrder:HqFieldOrder, private _diamondFieldOrder:DiamondFieldOrder){
        super();
    }

    Do(): void 
    {
        if(this.State === OrderState.None)
        {
            this._currentOrder = this._diamondFieldOrder; 
            this.State = OrderState.Pending;
            this.StartMoving();
        }

        if(this._currentOrder.IsDone())
        {
            if(this._currentOrder === this._diamondFieldOrder)
            {
                this._currentOrder = this._hqOrder;
            }
            else
            {
                this._currentOrder = this._diamondFieldOrder;
            }
            this.StartMoving();
        }
        else
        {
            this._currentOrder.Do();
        }
    }

    private StartMoving() {
        this._currentOrder.Reset();
        this._currentOrder.Do();
    }
    
}