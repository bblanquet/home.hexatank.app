import { Area } from "./Area";
import { Tank } from "../../Unit/Tank";
import { Ceil } from "../../Ceil";
import { TroopDecisionMaker } from "./TroopDecisionMaker";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { Headquarter } from "../../Field/Headquarter";
import { AreaStatus } from "./AreaStatus";
import { AreaDecisionMaker } from "./AreaDecisionMaker";

export class HeldArea
{
    private _areaDecisionMaker:AreaDecisionMaker;
    private _troops:Array<TroopDecisionMaker>;
    public HasReceivedRequest:boolean;

    constructor(private _hq:Headquarter,private _area:Area)
    { 
        this._troops = new Array<TroopDecisionMaker>();
        this._areaDecisionMaker = new AreaDecisionMaker(this);
    }

    public GetArea():Area{
        return this._area;
    }
 
    public GetTroops():Array<TroopDecisionMaker>
    {
        return this._troops;
    }

    public Update():void
    {
        if(0 < this.GetInsideEnemyCount())
        {
            this._areaDecisionMaker.Update();
        }
        else
        {
            this._troops.forEach(troop => {
                troop.Update();
            });
        }
    }

    public GetCentralCeil():Ceil{
        return this._area.GetCentralCeil();
    }

    public GetStatus():AreaStatus{
        this._troops = this._troops.filter(t=>t.Tank.IsAlive());
        return new AreaStatus(
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
        this._troops.push(new TroopDecisionMaker(ceil,tank,this)); 
    }

    public GetAvailableCeilCount():number{
        return this._area.GetAvailableCeil().filter(c=>this._troops.filter(t=>c===t.CurrentPatrolDestination).length === 0).length;
    }

    public GetAvailableCeil():Ceil
    {
        const ceils = this._area.GetAvailableCeil().filter(c=>this._troops.filter(t=>c===t.CurrentPatrolDestination).length === 0);

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