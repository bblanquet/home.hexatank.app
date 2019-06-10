import { Ceil } from "../../Ceil";
import { isNullOrUndefined } from "util";
import { AliveItem } from "../../AliveItem";

export class Area{

    constructor(private _centerCeil:Ceil){
    }
 
    public GetCentralCeil():Ceil{
        return this._centerCeil;
    }

    public GetAvailableCeil():Ceil[]
    {
        const ceils = this._centerCeil.GetAllNeighbourhood().map(c => <Ceil>c).filter(c=>!isNullOrUndefined(c) && !c.IsBlocked());
        const centralCeil = this.GetCentralCeil();
        if(!centralCeil.IsBlocked()){
            ceils.push(centralCeil);
        }
        return ceils;
    }

    public GetAllyCount(v:AliveItem):number{
        let enemyCount = 0;
        const ceils = this._centerCeil.GetAllNeighbourhood().map(c=><Ceil>c);
        ceils.push(this._centerCeil);
        ceils.forEach(ceil=>
        {
            if(ceil.ContainsAlly(v))
            {
                enemyCount += 1;
            }
        });
        return enemyCount;
    }

    public GetEnemyCount(v:AliveItem):number{
        let enemyCount = 0;
        const ceils = this._centerCeil.GetAllNeighbourhood().map(c=><Ceil>c);
        ceils.push(this._centerCeil);
        ceils.forEach(ceil=>
        {
            if(ceil.ContainsEnemy(v))
            {
                enemyCount += 1;
            }
        });
        return enemyCount;
    }
}