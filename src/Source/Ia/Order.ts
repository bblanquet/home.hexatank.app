import { IOrder } from "./IOrder";
import { OrderState } from "./OrderState";

export abstract class Order implements IOrder{

    protected State:OrderState;
    constructor()
    {
        this.State = OrderState.None;
    }

    public IsDone(): boolean {
        return this.State === OrderState.Failed
        || this.State === OrderState.Passed 
        || this.State === OrderState.Cancel;
    }

    public GetState(): OrderState {
        return this.State;
    }

    public Cancel(): void {
        this.State = OrderState.Cancel;
    }

    abstract Do(): void ;
}