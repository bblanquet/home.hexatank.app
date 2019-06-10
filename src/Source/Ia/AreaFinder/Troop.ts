import { Ceil } from "../../Ceil";
import { HqArea } from "./HqArea";
import { Tank } from "../../Unit/Tank";
import { ITimer } from "../../Tools/ITimer";
import { Timer } from "../../Tools/Timer";
import { isNullOrUndefined } from "util";
import { SimpleOrder } from "../Order/SimpleOrder";

export class Troop{
    private _changePositionTimer:ITimer; 
    private _cancelOrderTimer:ITimer;

    constructor(public CurrentCeil:Ceil,public Tank:Tank,public HqArea:HqArea)
    {
        if(isNullOrUndefined(this.CurrentCeil))
        {
            throw "invalid destination";
        }
        this._changePositionTimer = new Timer(20);
        this._cancelOrderTimer = new Timer(20);
    }

    public Update():void
    {
        if(this.Tank.GetCurrentCeil() === this.CurrentCeil)
        {
            if(this._changePositionTimer.IsElapsed())
            {
                const nextPatrolCeil = this.HqArea.GetAvailableCeil();
                if(nextPatrolCeil)
                {
                    this.CurrentCeil = nextPatrolCeil;
                }
            }         
        }
        else if(!this.Tank.IsExecutingOrder() && !this.Tank.HasPendingOrder())
        {
            this.Tank.SetOrder(new SimpleOrder(this.CurrentCeil,this.Tank));
        }
        else
        {
            if(this._cancelOrderTimer.IsElapsed())
            {
                this.Tank.CancelOrder();
            }
        }
    }

    public Cancel():void{
        this.Tank.CancelOrder();
    }
}