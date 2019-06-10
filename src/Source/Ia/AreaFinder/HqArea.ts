import { Area } from "./Area";
import { Tank } from "../../Unit/Tank";
import { Ceil } from "../../Ceil";
import { Troop } from "./Troop";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { Headquarter } from "../../Field/Headquarter";
import { HqStatus } from "../HqStatus";

export class HqArea
{
    private _troops:Array<Troop>;
    public HasReceivedRequest:boolean;

    constructor(private _hq:Headquarter,private _area:Area){ 
        this._troops = new Array<Troop>();
    }
 
    public Update():void{
        this._troops.forEach(troop => {
            troop.Update();
        });
    }

    public GetCentralCeil():Ceil{
        return this._area.GetCentralCeil();
    }

    public GetStatus():HqStatus{
        this._troops = this._troops.filter(t=>t.Tank.IsAlive());
        return new HqStatus(
            this.GetOutsideEnemyCount(),
            this.GetInsideEnemyCount(),
            this._troops.length,
            this.GetOutsideAllyCount(),
            this);
    }

    private GetOutsideEnemyCount() :number{
        let outsideEnemyCount = 0;
        PlaygroundHelper.GetNeighbourhoodAreas(this._area.GetCentralCeil()).forEach(area => {
            outsideEnemyCount += area.GetEnemyCount(this._hq);
        });
        return outsideEnemyCount;
    }

    private GetOutsideAllyCount() :number{
        let outsideEnemyCount = 0;
        PlaygroundHelper.GetNeighbourhoodAreas(this._area.GetCentralCeil()).forEach(area => {
            outsideEnemyCount += area.GetAllyCount(this._hq);
        });
        return outsideEnemyCount;
    }


    private GetInsideEnemyCount() :number{
        return this._area.GetEnemyCount(this._hq);
    }

    public HasTroop():boolean{
        return this._troops.length > 0;
    }

    public DropTroop():Tank{
        if(this._troops.length > 0){
            let troop = this._troops.splice(0,1)[0];
            troop.Cancel();
            return troop.Tank;
        }
        return null;
    }

    public AddTroop(tank:Tank, ceil:Ceil):void{
        this._troops.push(new Troop(ceil,tank,this)); 
    }

    public GetAvailableCeilCount():number{
        return this._area.GetAvailableCeil().filter(c=>this._troops.filter(t=>c===t.CurrentCeil).length === 0).length;
    }

    public GetAvailableCeil():Ceil
    {
        const ceils = this._area.GetAvailableCeil().filter(c=>this._troops.filter(t=>c===t.CurrentCeil).length === 0);

        if(ceils.length > 0)
        {
            let index = Math.floor(Math.random() * (ceils.length-1)) + 0;  
            return ceils[index];
        }
        else
        {
            return null;
        }
    }
}