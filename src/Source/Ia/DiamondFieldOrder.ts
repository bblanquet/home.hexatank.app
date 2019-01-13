import { SimpleOrder } from "./SimpleOrder";
import { Ceil } from "../Ceil";
import { Vehicle } from "../Vehicle";
import { Diamond } from "../Diamond";
import { Order } from "./Order";
import { OrderState } from "./OrderState";

export class DiamondFieldOrder extends Order
{

    private _simpleOrder:SimpleOrder;
    private _ceil:Ceil;

    constructor(private _diamond:Diamond,private _vehicule:Vehicle){
        super();
    }

    public Do(): void 
    {
        if(this.State === OrderState.None)
        {
            var ceils = this._diamond.Fields.filter(field => !field.GetCeil().IsBlocked());
            this._ceil = ceils[0].GetCeil();
            this.State = OrderState.Pending;
            this.StartMoving();
        }

        if(!this._simpleOrder.IsDone())
        {
            this._simpleOrder.Do();
        }
        else
        {
            this.State = this._simpleOrder.GetState();
        }
    }

    private StartMoving() {
        this._simpleOrder = new SimpleOrder(this._ceil, this._vehicule);
        this._simpleOrder.Do();
    }
}