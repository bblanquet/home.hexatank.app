import { IOrder } from "./IOrder";
import { Headquarter } from "../Headquarter";
import { Vehicle } from "../Vehicle";
import { OrderState } from "./OrderState";

export class HqFieldOrder implements IOrder
{
    GetState(): OrderState {
        throw new Error("Method not implemented.");
    }
    Cancel(): void {
        throw new Error("Method not implemented.");
    }
    private _hq:Headquarter;
    private _vehicule:Vehicle;
    private _isDone:boolean;

    public Init(hq:Headquarter,vehicule:Vehicle):void{
        this._vehicule = vehicule;
        this._hq = hq;
    }

    public Do(): void {
        var ceils = this._hq.Fields.filter(field => !field.GetCeil().IsBlocked());
        //this._vehicule.SetDestination(ceils[0]);     
    }

    public IsDone(): boolean {
        return this._isDone;
    }

}