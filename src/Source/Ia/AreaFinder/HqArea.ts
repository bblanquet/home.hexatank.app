import { Area } from "./Area";
import { HqRequest } from "../HqRequest";
import { Tank } from "../../Unit/Tank";
import { Ceil } from "../../Ceil";
import { Troop } from "./Troop";

export class HqArea
{
    private _troops:Array<Troop>;

    constructor(private _area:Area){ 
        this._troops = new Array<Troop>();
    }
 
    public GetTroopsCount():number{
        return this._troops.length;
    }

    public Update():void{
        this._troops.forEach(troop => {
            troop.Update();
        });
    }

    public GetCentralCeil():Ceil{
        return this._area.GetCentralCeil();
    }

    public GetRequest():HqRequest{
        this._troops = this._troops.filter(t=>t.Tank.IsAlive());
        
        if(this._troops.length < 1)
        {
            return HqRequest.MissingTank;
        }
        return HqRequest.None;
    }

    public AddTroop(tank:Tank, ceil:Ceil):void{
        this._troops.push(new Troop(ceil,tank,this)); 
    }

    public GetAvailableCeil():Ceil
    {
        let ceils = this._area.GetAvailableCeil().filter(c=>this._troops.filter(t=>c===t.CurrentCeil).length === 0);
        
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

// this._troops.forEach(troop=>{
        //     if(!troop[1].IsExecutingOrder() && troop[1].GetCurrentCeil() !== troop[0])
        //     {
        //         troop[1].SetOrder(new SimpleOrder(troop[0],troop[1]));
        //     }
        // })