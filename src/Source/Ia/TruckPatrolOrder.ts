import { Order } from "./Order";
import { Diamond } from "../Diamond";
import { Truck } from "../Truck";
import { Headquarter } from "../Headquarter";
import { OrderState } from "./OrderState";

export class TruckPatrolOrder extends Order
{
    constructor(private _diamond:Diamond,
                private _truck:Truck,
                private _hq:Headquarter){
                    super();
                }

    Do(): void 
    {
        if(this.State === OrderState.None){

        }
    }
    
}