import { Ceil } from "../../Ceil";
import { HqArea } from "./HqArea";
import { Tank } from "../../Unit/Tank";
import { ITimer } from "../../Tools/ITimer";
import { SimpleOrder } from "../SimpleOrder";
import { Timer } from "../../Tools/Timer";
import { isNullOrUndefined } from "util";

export class Troop{
    private _changePositionTimer:ITimer; 
    private _cancelOrderTimer:ITimer;

    constructor(public CurrentCeil:Ceil,public Tank:Tank,public HqArea:HqArea){
        this._changePositionTimer = new Timer(20);
        this._cancelOrderTimer = new Timer(300);
    }

    public Update():void
    {
        if(this.Tank.GetCurrentCeil() === this.CurrentCeil)
        {
            if(this._changePositionTimer.IsElapsed())
            {
                var selectedCeil = this.HqArea.GetAvailableCeil();
                if(!isNullOrUndefined(selectedCeil))
                {
                    this.CurrentCeil = selectedCeil;
                }
            }         
        }
        else if(!this.Tank.IsExecutingOrder())
        {
            this.Tank.SetOrder(new SimpleOrder(this.CurrentCeil,this.Tank));
        }else
        {
            if(this._cancelOrderTimer.IsElapsed())
            {
                this.Tank.CancelOrder();
            }
        }
    }
}