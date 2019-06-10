import { AreaStatus } from "../Area/AreaStatus";
import { Tank } from "../../Unit/Tank";

export class IdleUnitContainer{
    private statuses:Array<AreaStatus>;

    constructor(){

    }

    public CalculateExcess(statuses:Array<AreaStatus>):void{
        this.statuses = statuses.filter(s=>s.GetExcessTroops()>0);
    }

    public HasTank():boolean{
        if(this.statuses.length == 0){
            return false;
        }
        else if(this.statuses.length == 1)
        {
            return 0 < this.statuses[0].GetExcessTroops();
        }
        return true;
    }

    public Pop():Tank{
        while(this.statuses.length > 0){
            if(this.statuses[0].GetExcessTroops()===0){
                this.statuses.splice(0,1);
            }else{
                return this.statuses[0].Area.DropTroop();
            }
        }
        throw 'no tank avalaible';
    }

}