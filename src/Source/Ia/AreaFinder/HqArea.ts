import { Area } from "./Area";
import { HqRequest } from "../HqRequest";
import { Tank } from "../../Tank";
import { Ceil } from "../../Ceil";
import { SimpleOrder } from "../SimpleOrder";

export class HqArea
{
    private _troops:Array<[Ceil,Tank]>;

    constructor(private _area:Area){
        this._troops = new Array<[Ceil,Tank]>();
    }

    public GetTroopsCount():number{
        return this._troops.length;
    }

    public Update():void{
        this._troops.forEach(tank=>{
            if(!tank[1].IsExecutingOrder() && tank[1].GetCurrentCeil() !== tank[0])
            {
                tank[1].SetOrder(new SimpleOrder(tank[0],tank[1]));
            }
        })
    }

    public GetCentralCeil():Ceil{
        return this._area.GetCentralCeil();
    }

    public GetRequest():HqRequest{
        this._troops = this._troops.filter(t=>t[1].IsAlive());
        
        if(this._troops.length < 1)
        {
            return HqRequest.MissingTank;
        }
        return HqRequest.None;
    }

    public SendTank(tank:Tank):Ceil
    {
        var ceils = this._area.GetAvailableCeil().filter(c=>this._troops.filter(t=>c===t[0]).length === 0);
        if(ceils.length > 0)
        {
            var selectedCeil =ceils[0];
            this._troops.push([selectedCeil,tank]); 
            return selectedCeil;
        }
        else
        {
            return null;
        }
    }
}