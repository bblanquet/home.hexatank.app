import { Ceil } from "../../Ceils/Ceil";
import { HeldArea } from "./HeldArea";
import { ITimer } from "../../Utils/ITimer";
import { Timer } from "../../Utils/Timer";
import { isNullOrUndefined } from "util";  
import { SimpleOrder } from "../Order/SimpleOrder";
import { Tank } from "../../Items/Unit/Tank";

export class TroopDecisionMaker{ 
    private _changePositionTimer:ITimer; 
    private _cancelOrderTimer:ITimer;

    constructor(public CurrentPatrolDestination:Ceil,public Tank:Tank,public HqArea:HeldArea)
    {
        if(isNullOrUndefined(this.CurrentPatrolDestination)) 
        {
            throw "invalid destination";
        }
        if(isNullOrUndefined(this.Tank))
        {
            throw 'not possible';
        }

        this._changePositionTimer = new Timer(20);
        this._cancelOrderTimer = new Timer(20);
    }

    public Update():void
    {
        if(isNullOrUndefined(this.Tank))
        {
            throw 'not possible';
        }

        if(this.Tank.GetCurrentCeil() === this.CurrentPatrolDestination)
        {
            if(this._changePositionTimer.IsElapsed())
            {
                const nextPatrolCeil = this.HqArea.GetAvailableCeil();
                if(nextPatrolCeil)
                {
                    this.CurrentPatrolDestination = nextPatrolCeil;
                }
            }
        }
        else if(!this.Tank.IsExecutingOrder() && !this.Tank.HasPendingOrder())
        {
            this.Tank.SetOrder(new SimpleOrder(this.CurrentPatrolDestination,this.Tank));
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
        if(isNullOrUndefined(this.Tank))
        {
            throw 'not possible';
        }

        this.Tank.CancelOrder();
    }
}