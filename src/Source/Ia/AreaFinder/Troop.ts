import { Ceil } from "../../Ceil";
import { HqArea } from "./HqArea";
import { Tank } from "../../Tank";
import { ITimer } from "../../Tools/ITimer";
import { SimpleOrder } from "../SimpleOrder";
import { Timer } from "../../Tools/Timer";
import { isNullOrUndefined } from "util";

export class Troop{
    Timer:ITimer;

    constructor(public CurrentCeil:Ceil,public Tank:Tank,public HqArea:HqArea){
        this.Timer = new Timer(20);
    }

    public Update():void
    {
        if(this.Tank.GetCurrentCeil() === this.CurrentCeil)
        {
            if(this.Timer.IsElapsed)
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
        }
    }
}