import { PersistentOrder } from './PersistentOrder';
import { Order } from "./Order";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { SimpleOrder } from "./SimpleOrder";
import { Cell } from "../../Cell/Cell";
import { MoneyField } from "../../Cell/Field/MoneyField";

export class MoneyOrder extends Order{

    private _currentOrder:SimpleOrder;

    constructor(private _v:Vehicle){
        super();
    }

    Do(): void {
        if(this._currentOrder.IsDone()){
            this.TryToGetMoneyField();
        }
        else
        {
            this._currentOrder.Do();
        }
    }

    public Cancel(): void {
        super.Cancel();
        if(this._currentOrder)
        {
            this._currentOrder.Cancel();
        }
    }

    public GetFullMoneyFieldCount(range:number):number{
        return this._v.GetCurrentCell()
        .GetSpecificRange(range)
        .map(c=>c as Cell)
        .filter(c=>c.GetField() instanceof MoneyField
        && (<MoneyField>c.GetField()).IsFull()).length;
    }

    public GetFullMoneyField(range:number):Cell{
        return this._v.GetCurrentCell()
        .GetSpecificRange(range)
        .map(c=>c as Cell)
        .filter(c=>c.GetField() instanceof MoneyField
        && (<MoneyField>c.GetField()).IsFull())[0];
    }

    public TryToGetMoneyField():void{
        if(this.GetFullMoneyFieldCount(1))
        {
            const cell = this.GetFullMoneyField(1);
            this._currentOrder = new SimpleOrder(cell,this._v);
        }
        else if(this.GetFullMoneyFieldCount(2))
        {
            const cell = this.GetFullMoneyField(2);
            this._currentOrder = new SimpleOrder(cell,this._v);
        }
    }

}